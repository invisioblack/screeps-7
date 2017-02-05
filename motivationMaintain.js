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
MotivationMaintain.prototype.getDesiredSpawnUnit = function ()
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
			memory.needs[needName].type = "needRepair";
			memory.needs[needName].name = needName;
			memory.needs[needName].priority = C.PRIORITY_2;
			need.demands = global[need.type].getUnitDemands(roomName);
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
			memory.needs[needName].type = "needRepair";
			memory.needs[needName].name = needName;
			memory.needs[needName].priority = C.PRIORITY_3;
			need.demands = global[need.type].getUnitDemands(roomName);
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
			memory.needs[needName].type = "needBuild";
			memory.needs[needName].name = needName;
			memory.needs[needName].priority = C.PRIORITY_1;
			need.demands = global[need.type].getUnitDemands(roomName);
		}
	} else {
		delete memory.needs[needName];
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationMaintain();
