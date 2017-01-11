//-------------------------------------------------------------------------
// MotivationMaintainInfrastructure
//-------------------------------------------------------------------------
"use strict";

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Motivation = require("Motivation.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------
let REPAIR_FACTOR = 0.8;
//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationMaintainInfrastructure = function ()
{
	Motivation.call(this);
	this.name = "motivationMaintainInfrastructure";
};

MotivationMaintainInfrastructure.prototype = Object.create(Motivation.prototype);
MotivationMaintainInfrastructure.prototype.constructor = MotivationMaintainInfrastructure;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationMaintainInfrastructure.prototype.getDemands = function (roomName, resources)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	let constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
	let repairSites = Game.rooms[roomName].find(FIND_STRUCTURES, {
		filter: function (s) {
			return s.hits < s.hitsMax;
		}
	});
	let progress = _.sum(constructionSites, "progress");
	let progressTotal = _.sum(constructionSites, "progressTotal");

	result.energy = progressTotal - progress + Object.keys(repairSites).length;
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log('  Maintain Infrastructure Demands: ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationMaintainInfrastructure.prototype.getDesiredSpawnUnit = function ()
{
	// repairing and building require WORK and CARRY, so always workers
	return "worker";
};

MotivationMaintainInfrastructure.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numWorkers = strategyManager.countRoomUnits(roomName, "worker");

	if (memory.active)
	{
		let workers = strategyManager.countRoomUnits(roomName, "worker");
		if (!lib.isNull(demands.units["worker"]) && demands.units["worker"] <= workers)
			result = false;
	} else {
		result = false;
	}

	if (this.getDesiredSpawnUnit(roomName) === "worker" && numWorkers >= config.maxWorkers)
		result = false;

	return result;
};

MotivationMaintainInfrastructure.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (Object.keys(demands.units).length > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationMaintainInfrastructure.prototype.updateNeeds = function (roomName)
{
	let debug = false;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let sortedNeedsByDistance, x;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// Handle Build Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
	constructionSites.forEach(function (cs) {
		if (!lib.isNull(cs))
		{
			let needName = "build." + cs.id;

			//console.log('Site: ' + cs.id);

			// create new need if one doesn't exist
			if (lib.isNull(memory.needs[needName]))
			{
				memory.needs[needName] = {};
				memory.needs[needName].type = "needBuild";
				memory.needs[needName].name = needName;
				memory.needs[needName].targetId = cs.id;
				memory.needs[needName].priority = C.PRIORITY_5;
			}
		}
	}, this);

	// Handle Repair Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let repairSites = room.find(FIND_STRUCTURES, {
		filter: function (s) {
			return s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART;
		}
	});
	repairSites.forEach(function (rs) {
		let needName = "repair." + rs.id;

		//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);
		//console.log(rs.id + " HP/Threshold: " + rs.hits + "/" + (rs.hitsMax * REPAIR_FACTOR));
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]) && rs.hits < (rs.hitsMax * REPAIR_FACTOR))
		{
			memory.needs[needName] = {};
			memory.needs[needName].type = "needRepair";
			memory.needs[needName].name = needName;
			memory.needs[needName].targetId = rs.id;
			memory.needs[needName].priority = C.PRIORITY_1;
		}
	}, this);

	// Handle WALLRepair Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let wallHP = config.wallHP[lib.isNull(room.controller) ? 0 : room.controller.level];
	let wallRepairSites = room.find(FIND_STRUCTURES, {
		filter: function (s) {
			return (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && s.hits < wallHP;
		}
	});
	wallRepairSites.forEach(function (rs) {
		let needName;
		if (rs.structureType === STRUCTURE_WALL)
			needName = "repairWall." + rs.id;
		else if (rs.structureType === STRUCTURE_RAMPART)
			needName = "repairRampart." + rs.id;

		//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);
		//console.log(rs.id + " HP/Threshold: " + rs.hits + "/" + (wallHP * REPAIR_FACTOR));
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]) && rs.hits < (wallHP * REPAIR_FACTOR))
		{
			memory.needs[needName] = {};
			memory.needs[needName].type = "needRepair";
			memory.needs[needName].name = needName;
			memory.needs[needName].targetId = rs.id;
			memory.needs[needName].priority = C.PRIORITY_1;
		}
	}, this);

	for (let needName in memory.needs)
	{
		//console.log("Need: " + needName);

		if (lib.isNull(memory.needs[needName]))
		{
			lib.log("-------------- CULLING NULL maintain infrastructure need -------------", debug);
			delete memory.needs[needName];
		}
		else
		{
			//console.log("Need.type: " + memory.needs[needName].type);
			if (lib.isNull(memory.needs[needName].type))
			{
				lib.log("-------------- CULLING untyped maintain infrastructure need -------------", debug);
				delete memory.needs[needName];

			} else if (memory.needs[needName].type === "needBuild") {
				// cull build needs
				if (lib.isNull(memory.needs[needName].targetId))
				{
					lib.log("-------------- CULLING INCOMPLETE CONSTRUCTION SITE -------------", debug);
					delete memory.needs[needName];
				}
				else
				{
					let siteId = memory.needs[needName].targetId;
					let result = _.filter(constructionSites , {"id": siteId});

					// if there are no sites, then cull it
					if (result.length === 0)
					{
						lib.log("-------------- CULLING CONSTRUCTION SITE -------------", debug);
						delete memory.needs[needName];
					}
				}

			} else if (memory.needs[needName].type === "needRepair") {
				// cull repair needs
				if (lib.isNull(memory.needs[needName].targetId))
				{
					lib.log("-------------- CULLING INCOMPLETE REPAIR SITE -------------", debug);
					delete memory.needs[needName];
				}
				else
				{

					let siteId = memory.needs[needName].targetId;
					let result = _.filter(repairSites , {"id": siteId});
					let resultWall = _.filter(wallRepairSites , {"id": siteId});

					// if there are no sites, then cull it
					if (result.length === 0 && resultWall.length === 0)
					{
						lib.log("-------------- CULLING REPAIR SITE: " + siteId, debug);
						delete memory.needs[needName];
					}
				}
			}
		}
	}

	// prioritize needs
	for (let needName in memory.needs)
	{
		let need = memory.needs[needName];
		let site = Game.getObjectById(need.targetId);

		switch (site.structureType)
		{
			case STRUCTURE_SPAWN:
				need.priority = C.PRIORITY_1;
				break;
			case STRUCTURE_TOWER:
				need.priority = C.PRIORITY_2;
				break;
			case STRUCTURE_EXTENSION:
				need.priority = C.PRIORITY_3;
				break;
			case STRUCTURE_CONTAINER:
				need.priority = C.PRIORITY_4;
				break;
			default:
				need.priority = C.PRIORITY_5;
				break;
		}

		if (need.type === "needRepair")
		{
			let percent;
			let max = site.hitsMax;

			if (site.structureType === STRUCTURE_WALL || site.structureType === STRUCTURE_RAMPART)
				max =  config.wallHP[room.controller.level];
			percent = (site.hits / max) * 10000 / 100;
			//console.log(needName + " PERCENT: " + percent);
			if (percent < 5)
			{
				need.priority = C.PRIORITY_3;
			}
			else if (percent < 15)
			{
				need.priority = C.PRIORITY_4;
			}
			else if (percent < 25)
			{
				need.priority = C.PRIORITY_5;
			}
			else if (percent < 50)
			{
				need.priority = C.PRIORITY_6;
			}
			else if (percent < 75)
			{
				need.priority = C.PRIORITY_7;
			}
			else
			{
				need.priority = C.PRIORITY_8;
			}
		}
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationMaintainInfrastructure();