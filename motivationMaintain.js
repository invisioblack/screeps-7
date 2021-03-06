"use strict";

let Motivation = require("Motivation.prototype")();

/**
 * MotivationMaintain
 * @constructor
 */
let MotivationMaintain = function ()
{
	Motivation.call(this);
	this.name = "motivationMaintain";
};

MotivationMaintain.prototype = Object.create(Motivation.prototype);
MotivationMaintain.prototype.constructor = MotivationMaintain;

/**
 * getDesiredSpawnUnit
 * @returns {string}
 */
MotivationMaintain.prototype.getDesiredSpawnUnit = function (roomName, unitDemands)
{
	return "worker";
};

/**
 * getAssignableUnitNames
 * @returns {[string]}
 */
MotivationMaintain.prototype.getAssignableUnitNames = function ()
{
	return ["worker"];
};


/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationMaintain.prototype.updateActive = function (roomName)
{
	Memory.rooms[roomName].motivations[this.name].active = true;
	return Memory.rooms[roomName].motivations[this.name].active;
};

/**
 * updateNeeds
 * @param roomName
 */
MotivationMaintain.prototype.updateNeeds = function (roomName)
{
	let debug = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let structuresNoWall = Room.getStructuresType(roomName , STRUCTURE_ALL_NOWALL);
	let numRepairSites = _.filter(structuresNoWall , s => s.hits < (s.hitsMax * config.repairFactor)).length;
	let needName;
	let structuresWall = Room.getStructuresType(roomName , STRUCTURE_ALL_WALL);
	let wallHP = config.wallHP[lib.isNull(room.controller) ? 0 : room.controller.level];
	let numConstructionSites = Room.getConstructionIds(room.name).length;
	let need;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// create repair need
	needName = "repairNoWall." + roomName;
	if (numRepairSites > 0)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.type = "needRepair";
			need.name = needName;
			need.priority = C.PRIORITY_2;
			need.demands = global[need.type].getUnitDemands(roomName, need, this.name);
		}
	} else {
		delete memory.needs[needName];
	}

	// create wall repair need



	numRepairSites = _.filter(structuresWall, (s) => { return s.hits < (wallHP * config.repairFactor); }).length;
	needName = "repairWall." + roomName;

	if (numRepairSites > 0)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.type = "needRepair";
			need.name = needName;
			need.priority = C.PRIORITY_3;
			need.demands = global[need.type].getUnitDemands(roomName, need, this.name);
		}
	} else {
		delete memory.needs[needName];
	}

	// create build need

	needName = "build." + roomName;

	if (numConstructionSites > 0)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.type = "needBuild";
			need.name = needName;
			need.priority = C.PRIORITY_1;
			need.demands = global[need.type].getUnitDemands(roomName, need, this.name);
		}
	} else {
		delete memory.needs[needName];
	}

	// build remote maintain needs
	_.forEach(room.memory.rHarvestTargets , (rN) =>
	{
		needName = "rMaintain." + rN;

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needRMaintain";
			need.targetRoom = rN;
			need.priority = C.PRIORITY_4;
			need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
		}
	});

	// cull unneeded remote harvest needs
	_.forEach(memory.needs , (v , k) =>
	{
		if (v.type === "needRMaintain" && !_.some(room.memory.rHarvestTargets , o => v.targetRoom === o))
		{
			delete memory.needs[k];
		}
	});
};

/**
 * Export
 * @type {MotivationMaintain}
 */
module.exports = new MotivationMaintain();
