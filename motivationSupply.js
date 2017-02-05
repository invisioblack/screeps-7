"use strict";

let Motivation = require("Motivation.prototype")();

let MotivationSupply = function ()
{
	Motivation.call(this);
	this.name = "motivationSupply";
};

MotivationSupply.prototype = Object.create(Motivation.prototype);
MotivationSupply.prototype.constructor = MotivationSupply;

/**
 * getDesiredSpawnUnit
 * @param roomName
 * @returns {string}
 */
MotivationSupply.prototype.getDesiredSpawnUnit = function (roomName, unitDemands)
{
	let numWorkers = Room.countHomeRoomMotivationUnits(roomName, this.name, "worker");

	if (numWorkers < unitDemands["worker"])
	{
		return "worker"
	}
	else
	{
		return "hauler";
	}
};

/**
 * getAssignableUnitNames
 * @returns {[string]}
 */
MotivationSupply.prototype.getAssignableUnitNames = function ()
{
	return ["worker", "hauler"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationSupply.prototype.updateActive = function (roomName)
{
	Memory.rooms[roomName].motivations[this.name].active = true;
	return Memory.rooms[roomName].motivations[this.name].active;
};

/**
 * updateNeeds
 * @param roomName
 */
MotivationSupply.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// build supply controller
	let needName = "supplyController." + roomName;
	let need;

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]))
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needSupplyController";
		need.targetId = room.controller.id;
		need.priority = C.PRIORITY_3;
		need.demands = global[need.type].getDemands(roomName);
	}
};

/**
 * Export
 * @type {MotivationSupply}
 */
module.exports = new MotivationSupply();