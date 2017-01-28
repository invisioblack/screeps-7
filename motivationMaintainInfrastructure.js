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
MotivationMaintainInfrastructure.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
    let unitName = this.getDesiredSpawnUnit();
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log('  Maintain Infrastructure Demands: ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationMaintainInfrastructure.prototype.getDesiredSpawnUnit = function ()
{
	return "worker";
};

MotivationMaintainInfrastructure.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numWorkers = creepManager.countHomeRoomUnits(roomName, "worker");

	if (!memory.active || lib.isNull(demands.units["worker"]) || demands.units["worker"] <= numWorkers)
	{
		result = false;
	}

	return result;
};

MotivationMaintainInfrastructure.prototype.getAssignableUnitNames = function ()
{
	return ["worker"];
};


/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationMaintainInfrastructure.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	memory.active = true;
};

MotivationMaintainInfrastructure.prototype.updateNeeds = function (roomName)
{
	let debug = false;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let structuresNoWall;
	let numRepairSites;
	let needName;
	let structuresWall;
	let wallHP;
	let numConstructionSites;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// create repair need
	structuresNoWall = roomManager.getStructuresType(roomName , STRUCTURE_ALL_NOWALL);
	numRepairSites = _.filter(structuresNoWall , (s) =>
	{
		return s.hits < (s.hitsMax * config.repairFactor);
	}).length;
	needName = "repairNoWall." + roomName;

	if (numRepairSites > 0)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			memory.needs[needName].type = "needRepair";
			memory.needs[needName].name = needName;
			memory.needs[needName].priority = C.PRIORITY_1;
		}
	} else {
		delete memory.needs[needName];
	}

	// create wall repair need
	structuresWall = roomManager.getStructuresType(roomName , STRUCTURE_ALL_WALL);

	wallHP = config.wallHP[lib.isNull(room.controller) ? 0 : room.controller.level];
	numRepairSites = _.filter(structuresWall, (s) => { return s.hits < (wallHP * config.repairFactor); }).length;
	needName = "repairWall." + roomName;

	if (numRepairSites > 0)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			memory.needs[needName].type = "needRepair";
			memory.needs[needName].name = needName;
			memory.needs[needName].priority = C.PRIORITY_2;
		}
	} else {
		delete memory.needs[needName];
	}

	// create build need
	numConstructionSites = room.find(FIND_CONSTRUCTION_SITES).length;
	needName = "build." + roomName;

	if (numConstructionSites > 0)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			memory.needs[needName].type = "needBuild";
			memory.needs[needName].name = needName;
			memory.needs[needName].priority = C.PRIORITY_3;
		}
	} else {
		delete memory.needs[needName];
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationMaintainInfrastructure();
