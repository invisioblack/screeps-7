//----------------------------------------------------------------------------------------------------------------------
// motivationHaulToStorage
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
let MotivationHaulMinerals = function ()
{
	Motivation.call(this);
	this.name = "motivationHaulMinerals";
};

MotivationHaulMinerals.prototype = Object.create(Motivation.prototype);
MotivationHaulMinerals.prototype.constructor = MotivationHaulMinerals;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationHaulMinerals.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
	//let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName , result);
	//lib.log("  Haul Minerals Demands: " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHaulMinerals.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "hauler";
};

MotivationHaulMinerals.prototype.getDesireSpawn = function (roomName , demands)
{
	let debug = false;
	let result = false;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let unitName = this.getDesiredSpawnUnit(roomName);
	let unitsDemanded = 0;
	let units = {};
	units.hauler = Room.countMotivationUnits(roomName , this.name , "hauler");
	let roomUnits = {};
	roomUnits.hauler = Room.countHomeRoomUnits(roomName , "hauler");

	if (memory.active && roomUnits.hauler < config.unit.max.hauler && room.memory.mode === C.ROOM_MODE_NORMAL)
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

MotivationHaulMinerals.prototype.getAssignableUnitNames = function ()
{
	return ["hauler"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationHaulMinerals.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let storageIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_STORAGE] , []);
	let mineralContainer = Game.getObjectById(room.memory.mineralContainerId);
	let containerTotal = 0;
	if (!lib.isNull(mineralContainer))
	{
		containerTotal = _.sum(mineralContainer.store);
	}

	if ((room.isMine && room.controller.level >= 4 && storageIds.length > 0) && !lib.isNull(mineralContainer) && containerTotal > 500)
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

MotivationHaulMinerals.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let mineralContainer = Game.getObjectById(room.memory.mineralContainerId);

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	if (!lib.isNull(mineralContainer))
	{
		// pick up energy in room need -------------------------------------------------------------------------------------
		let needName = "haulMinerals." + room.name;
		let need;
		let storageIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_STORAGE] , []);
		let storages = _.map(storageIds , (id) =>
		{
			return Game.getObjectById(id)
		});

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]) && storages.length)
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHaulMinerals";
			need.targetId = room.memory.cache.structures[STRUCTURE_STORAGE][0];
			need.priority = C.PRIORITY_1;
		}
		else
		{
			need = memory.needs[needName];
		}
	}
	else
	{
		memory.needs = {};
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHaulMinerals();
