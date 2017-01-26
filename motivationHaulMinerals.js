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
MotivationHaulMinerals.prototype.getDemands = function (roomName) {
	let debug = false;
	let result = {};
	//let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//lib.log("  Haul Minerals Demands: " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHaulMinerals.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "hauler";
};

MotivationHaulMinerals.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numHaulers = creepManager.countRoomUnits(roomName, "hauler");

	if (memory.active)
	{
		if ((!lib.isNull(demands.units["hauler"]) && demands.units["hauler"] <= numHaulers))
		{
			result = false;
		}
	} else {
		result = false;
	}

	if (numHaulers >= config.maxHaulers)
		result = false;

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
	let storageIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_STORAGE], []);
	let mineralContainer = Game.getObjectById(room.memory.mineralContainerId);
	let containerTotal = 0;
	if (!lib.isNull(mineralContainer))
	{
		containerTotal = _.sum(mineralContainer.store);
	}

	if ((room.getIsMine() && room.controller.level >= 4 && storageIds.length > 0) && !lib.isNull(mineralContainer) && containerTotal > 500)
	{
		memory.active = true;
	} else {
		memory.active = false;
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
		let storageIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_STORAGE], []);
		let storages = _.map(storageIds, (id) => {
			return Game.getObjectById(id)
		});

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]) && storages.length) {
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHaulMinerals";
			need.targetId = room.memory.cache.structures[STRUCTURE_STORAGE][0];
			need.priority = C.PRIORITY_1;
		} else {
			need = memory.needs[needName];
		}
	} else
	{
		memory.needs = {};
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHaulMinerals();
