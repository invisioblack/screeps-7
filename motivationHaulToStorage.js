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
let MotivationHaulToStorage = function ()
{
	Motivation.call(this);
	this.name = "motivationHaulToStorage";
};

MotivationHaulToStorage.prototype = Object.create(Motivation.prototype);
MotivationHaulToStorage.prototype.constructor = MotivationHaulToStorage;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationHaulToStorage.prototype.getDemands = function (roomName) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log("  Haul to Storage Demands: " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHaulToStorage.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "hauler";
};

MotivationHaulToStorage.prototype.getDesireSpawn = function (roomName, demands)
{
	if (roomManager.getIsLongDistanceHarvestTarget(roomName))
		return false;

	let debug = false;
	let result = false;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let unitName = this.getDesiredSpawnUnit(roomName);
	let unitsDemanded = 0;
	let units = {};
	units.worker = creepManager.countRoomMotivationUnits(roomName, this.name, "worker");
	units.hauler = creepManager.countRoomMotivationUnits(roomName, this.name, "hauler");
	let roomUnits = {};
	roomUnits.worker = creepManager.countHomeRoomUnits(roomName, "worker");
	roomUnits.hauler = creepManager.countHomeRoomUnits(roomName, "hauler");

	if (memory.active && roomUnits[unitName] < config.unit.max[unitName] && room.memory.mode === C.ROOM_MODE_NORMAL)
	{
		unitsDemanded = lib.nullProtect(demands.units[unitName], 0);
	    if (units[unitName] < unitsDemanded)
	    {
		    result = true;
	    }
	}

	lib.log(`Room: ${roomLink(roomName)} ${this.name}.getDesireSpawn: active: ${memory.active} Result: ${result} unit: ${unitName} A/D: ${units[unitName]}/${unitsDemanded} R/D: ${roomUnits[unitName]}/${room.memory.demands[unitName]}`, debug);

	return result;
};

MotivationHaulToStorage.prototype.getAssignableUnitNames = function ()
{
	return ["worker", "hauler"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationHaulToStorage.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let storageIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_STORAGE], []);

	if ((room.getIsMine() && room.controller.level >= 4 && storageIds.length > 0) || roomManager.getIsLongDistanceHarvestTarget(roomName))
	{
		memory.active = true;
	} else {
		memory.active = false;
		memory.demands.spawn = false;
		memory.spawnAllocated = false;
	}
};

MotivationHaulToStorage.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}


	if (roomManager.getIsMine(roomName)) {

		// pick up energy in room need -------------------------------------------------------------------------------------
		let needName = "haulStorage." + room.name;
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
			need.type = "needHaulToStorage";
			need.targetId = room.memory.cache.structures[STRUCTURE_STORAGE][0];
			need.priority = C.PRIORITY_1;
		} else {
			need = memory.needs[needName];
		}

		if (room.memory.energyPickupMode === C.ROOM_ENERGYPICKUPMODE_LINK && lib.isNull(need.linkId)) {
			let storage = Game.getObjectById(room.memory.cache.structures[STRUCTURE_STORAGE][0]);
			let links = _.map(room.memory.cache.structures[STRUCTURE_LINK], (id) => { return Game.getObjectById(id); });
			let link = storage.pos.findInRange(links, 1)[0];

			need.linkId = link.id;
			room.memory.storageLinkId = link.id;
		}

		// pick up in ldh rooms --------------------------------------------------------------------------------------------
		_.forEach(room.memory.longDistanceHarvestTargets, (rN) => {
			let ldhNeed;
			needName = "ldhaulstorage." + rN;
			let numContainers = roomManager.getStructureIdType(rN, STRUCTURE_CONTAINER).length;

			if (numContainers > 0) {
				if (lib.isNull(memory.needs[needName]))
					memory.needs[needName] = {};
				ldhNeed = memory.needs[needName];
				ldhNeed.name = needName;
				ldhNeed.type = "needLongDistancePickup";
				ldhNeed.targetRoom = rN;
				need.priority = C.PRIORITY_6;
			} else
				delete memory.needs[needName];
		});

		_.forEach(room.memory.motivations[this.name].needs, (v, k) => {
			let targetRoom = Game.rooms[v.targetRoom];
			if (!lib.isNull(targetRoom))
			{
				let energy = targetRoom.getContainerEnergy();
				//console.log(`Room: ${v.targetRoom} energy: ${JSON.stringify(energy)}`);
				if (energy.energy > 2000)
				{
					v.priority = need.priority = C.PRIORITY_1;
				} else if (energy.energy > 1700)
				{
					v.priority = need.priority = C.PRIORITY_2;
				} else if (energy.energy > 1500)
				{
					v.priority = need.priority = C.PRIORITY_3;
				} else if (energy.energy > 1000)
				{
					v.priority = need.priority = C.PRIORITY_4;
				}
				else
				{
					v.priority = need.priority = C.PRIORITY_5;
				}
			}
			if (!_.some(room.memory.longDistanceHarvestTargets, (o) => { return v.targetRoom === o || v.type !== "needLongDistancePickup"; }))
				delete memory.needs[k];
		});
	}
	else if (roomManager.getIsLongDistanceHarvestTarget(roomName))
	{
		let needName = "ldpickup." + room.name;
		let need;
		let containerIds = roomManager.getStructureIdType(roomName, STRUCTURE_CONTAINER);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]) && containerIds.length) {
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needLongDistancePickup";
			need.targetIds = containerIds;
			need.priority = C.PRIORITY_1;
		} else if (containerIds.length) {
			need = memory.needs[needName];
		} else
		{
			delete memory.needs[needName];
		}

	} else
	{
		memory.needs = {};
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHaulToStorage();
