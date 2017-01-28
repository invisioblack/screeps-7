//-------------------------------------------------------------------------
// motivationSupplyTower
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
let MotivationSupplyTower = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplyTower";
};

MotivationSupplyTower.prototype = Object.create(Motivation.prototype);
MotivationSupplyTower.prototype.constructor = MotivationSupplyTower;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationSupplyTower.prototype.getDemands = function (roomName)
{
	let debug = false;
	let room = Game.rooms[roomName];
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	let towerIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_TOWER] , []);
	let towers = _.map(towerIds , (o) =>
	{
		return Game.getObjectById(o)
	});

	let energy = _.sum(towers , "energy");
	let energyTotal = _.sum(towers , "energyCapacity");
	result.energy = energyTotal - energy;
	result.units = this.getUnitDemands(roomName);
	if (lib.isNull(result.units["worker"]))
	{
		result.units["worker"] = 0;
	}
	result.spawn = this.getDesireSpawn(roomName , result);
	lib.log('  Supply Tower Demands: e: ' + result.energy + ' ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn , debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationSupplyTower.prototype.getDesireSpawn = function (roomName , demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (memory.active)
	{
		for (let unitName in units)
		{
			let numUnits = creepManager.countRoomUnits(roomName , unitName);
			if (!lib.isNull(demands.units[unitName]) || demands.units[unitName] <= numUnits || numUnits >= config.unit.max[unitName])
			{
				result = false;
			}
		}
	}
	else
	{
		result = false;
	}

	return result;
};

MotivationSupplyTower.prototype.getDesiredSpawnUnit = function (roomName)
{
	let energyPickupMode = lib.nullProtect(Memory.rooms[roomName].energyPickupMode , C.ROOM_ENERGYPICKUPMODE_NOENERGY);
	let numWorkers = creepManager.countRoomUnits(roomName , "worker");

	if (energyPickupMode < C.ROOM_ENERGYPICKUPMODE_CONTAINER || numWorkers <= config.critWorkers)
	{
		return "worker";
	}
	else
	{
		return "hauler";
	}
};

MotivationSupplyTower.prototype.getAssignableUnitNames = function ()
{
	return ["worker" , "hauler"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationSupplyTower.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (room.getIsMine())
	{
		memory.active = true;
	}
	else
	{
		memory.active = false;
		memory.demands.spawn = false;
		memory.spawnAllocated = false;
	}
};

MotivationSupplyTower.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let towerIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_TOWER] , []);

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	towerIds.forEach(function (id)
	{
		let needName = "supplyTower." + id;
		let need;
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.type = "needTransferEnergy";
			need.name = needName;
			need.targetId = id;
			need.priority = C.PRIORITY_2;
		}
	} , this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplyTower();