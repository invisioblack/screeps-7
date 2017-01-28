//-------------------------------------------------------------------------
// jobBuild
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
let MotivationSupplySpawn = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplySpawn";
};

MotivationSupplySpawn.prototype = Object.create(Motivation.prototype);
MotivationSupplySpawn.prototype.constructor = MotivationSupplySpawn;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationSupplySpawn.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName , result);
	lib.log('  Supply Spawn Demands: e: ' + result.energy + ' ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn , debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationSupplySpawn.prototype.getDesireSpawn = function (roomName , demands)
{
	let debug = false;
	let result = false;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let unitName = this.getDesiredSpawnUnit(roomName);
	let unitsDemanded = 0;
	let units = {};
	units.worker = creepManager.countRoomMotivationUnits(roomName , this.name , "worker");
	units.hauler = creepManager.countRoomMotivationUnits(roomName , this.name , "hauler");
	let roomUnits = {};
	roomUnits.worker = creepManager.countHomeRoomUnits(roomName , "worker");
	roomUnits.hauler = creepManager.countHomeRoomUnits(roomName , "hauler");

	if (memory.active && room.memory.demands[unitName] > roomUnits[unitName] && roomName[unitName] < config.unit.max[unitName])
	{
		unitsDemanded = lib.nullProtect(demands.units[unitName] , 0);
		if (units[unitName] < unitsDemanded)
		{
			result = true;
		}
	}

	lib.log(`Room: ${roomLink(roomName)} ${this.name}.getDesireSpawn: active: ${memory.active} Result: ${result} unit: ${unitName} A/D: ${units[unitName]}/${unitsDemanded} R/D: ${roomUnits[unitName]}/${room.memory.demands[unitName]}` , debug);

	return result;
};

MotivationSupplySpawn.prototype.getDesiredSpawnUnit = function (roomName)
{
	let energyPickupMode = lib.nullProtect(Memory.rooms[roomName].energyPickupMode , C.ROOM_ENERGYPICKUPMODE_NOENERGY , C.ROOM_ENERGYPICKUPMODE_NOENERGY);

	if (energyPickupMode < C.ROOM_ENERGYPICKUPMODE_CONTAINER || Memory.rooms[roomName].mode === C.ROOM_MODE_WORKER_PANIC)
	{
		return "worker";
	}
	else
	{
		return "hauler";
	}
};

MotivationSupplySpawn.prototype.getAssignableUnitNames = function ()
{
	return ["worker" , "hauler"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationSupplySpawn.prototype.updateActive = function (roomName)
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

MotivationSupplySpawn.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let sortedNeedsByDistance , x;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// spawns ----------------------------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	for (let spawnName in Game.spawns)
	{
		// loop over spawns in room
		let spawn = Game.spawns[spawnName];
		if (spawn.room.name === roomName)
		{
			let needName = "supplySpawn." + spawn.id;
			let need;

			// create needs if we need energy, cull needs if not
			if ((spawn.energyCapacity - spawn.energy) > 0)
			{
				// create new need if one doesn't exist
				if (lib.isNull(memory.needs[needName]))
				{
					memory.needs[needName] = {};
					need = memory.needs[needName];
					need.type = "needTransferEnergy";
					need.name = needName;
					need.targetId = spawn.id;
					need.priority = C.PRIORITY_2;
				}
			}
			else
			{ // cull need if we don't need energy
				delete memory.needs[needName];
			}
		}
	}

	// extenders -------------------------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let needName = "supplyExtenders." + roomName;
	let need;
	let extenderEnergy = room.getExtenderEnergy();

	if ((extenderEnergy.energyCapacity - extenderEnergy.energy) > 0)
	{
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.type = "needSupplyExtenders";
			need.name = needName;
			need.priority = C.PRIORITY_1;
		}
	}
	else
	{ // cull need if we don't need energy
		delete memory.needs[needName];
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplySpawn();