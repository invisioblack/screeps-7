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
	let numWorkers = Room.countMotivationUnits(roomName, this.name, "worker");
	let room = Game.rooms[roomName];

	if (numWorkers < unitDemands["worker"] || room.energyPickupMode < C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
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
	let needName, need;
	let spawns = Room.getSpawns(roomName);
	let towers = Room.getStructuresType(roomName, STRUCTURE_TOWER);

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// build supply spawn needs
	_.forEach(spawns, spawn =>
	{
		needName = "supplySpawn." + spawn.name;

		if (spawn.energy < spawn.energyCapacity)
		{
			// create new need if one doesn't exist
			if (lib.isNull(memory.needs[needName]))
			{
				memory.needs[needName] = {};
				need = memory.needs[needName];
				need.name = needName;
				need.type = "needSupplySpawn";
				need.targetId = spawn.id;
				need.priority = C.PRIORITY_2;
				need.demands = global[need.type].getUnitDemands(roomName, need, this.name);
			}
		}
		else
		{
			delete memory.needs[needName];
		}
	});

	// build extender need
	needName = "supplyExtenders." + roomName;

	if (room.extenderEnergy.energy < room.extenderEnergy.energyCapacity)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needSupplyExtenders";
			need.priority = C.PRIORITY_1;
			need.demands = global[need.type].getUnitDemands(roomName, need, this.name);
		}
	}
	else
	{
		delete memory.needs[needName];
	}

	// build supply controller
	needName = "supplyController." + roomName;

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]))
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needSupplyController";
		need.targetId = room.controller.id;
		need.priority = C.PRIORITY_3;
		need.demands = global[need.type].getUnitDemands(roomName, need, this.name);
	}

	// build extender need
	_.forEach(towers, tower =>
	{
		needName = "supplyTowers." + tower.id;

		if (tower.energy <= (tower.energyCapacity * config.towerPowerFactor))
		{
			// create new need if one doesn't exist
			if (lib.isNull(memory.needs[needName]))
			{
				memory.needs[needName] = {};
				need = memory.needs[needName];
				need.name = needName;
				need.type = "needSupplyTowers";
				need.targetId = tower.id;
				need.priority = C.PRIORITY_4;
				need.demands = global[need.type].getUnitDemands(roomName, need, this.name);
			}
		}
		else
		{
			delete memory.needs[needName];
		}
	});
};

/**
 * Export
 * @type {MotivationSupply}
 */
module.exports = new MotivationSupply();