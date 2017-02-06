"use strict";

let Motivation = require("Motivation.prototype")();

/**
 * MotivationHaulToStorage
 * @constructor
 */
let MotivationHaul = function ()
{
	Motivation.call(this);
	this.name = "motivationHaul";
};

MotivationHaul.prototype = Object.create(Motivation.prototype);
MotivationHaul.prototype.constructor = MotivationHaul;

/**
 * getDesiredSpawnUnit
 * @param roomName
 * @param unitDemands
 * @returns {string}
 */
MotivationHaul.prototype.getDesiredSpawnUnit = function (roomName , unitDemands)
{
	return "hauler";
};

/**
 * getAssignableUnitNames
 * @returns {[string,string]}
 */
MotivationHaul.prototype.getAssignableUnitNames = function ()
{
	return ["worker" , "hauler"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationHaul.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if ((room.isMine && room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER) || room.isRHarvestTarget)
	{
		memory.active = true;
	}
	else
	{
		memory.active = false;
		memory.spawnAllocated = false;
	}
};

/**
 * updateNeeds
 * @param roomName
 */
MotivationHaul.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let needName , need;
	let storage = Room.getStructuresType(roomName , STRUCTURE_STORAGE)[0];
	let containers = Room.getStructuresType(roomName , STRUCTURE_CONTAINER);
	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// build haul needs for my room
	if (Room.getIsMine(roomName))
	{
		if (!lib.isNull(storage))
		{
			// create needs to empty all containers in the room

			_.forEach(containers , container =>
			{
				needName = "haulContainer." + container.id;
				if (container.carrying > 1000)
				{
					// create new need if one doesn't exist
					if (lib.isNull(memory.needs[needName]))
					{
						memory.needs[needName] = {};
						need = memory.needs[needName];
						need.name = needName;
						need.type = "needHaul";
						need.sourceId = container.id;
						need.targetId = storage.id;
						need.priority = C.PRIORITY_1;
						need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
					}
					else
					{
						need = memory.needs[needName];
					}
				}
				else
				{
					delete memory.needs[needName];
				}
			});

			// create needs to manage links
			if (room.energyPickupMode === C.ROOM_ENERGYPICKUPMODE_LINK)
			{
				let storageLink = Game.getObjectById(room.memory.storageLinkId);
				if (lib.isNull(storageLink))
				{
					let links = Room.getStructuresType(roomName , STRUCTURE_LINK);
					storageLink = storage.pos.findInRange(links , 1)[0];
				}
				if (!lib.isNull(storageLink))
				{
					room.memory.storageLinkId = storageLink.id;
					needName = "haulLink." + storageLink.id;
					// create storage link id
					// create new need if one doesn't exist
					if (lib.isNull(memory.needs[needName]))
					{
						memory.needs[needName] = {};
						need = memory.needs[needName];
						need.name = needName;
						need.type = "needHaul";
						need.sourceId = storageLink.id;
						need.targetId = storage.id;
						need.priority = C.PRIORITY_2;
						need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
					}
					else
					{
						need = memory.needs[needName];
					}
				}
			}

			// create needs to pick up in remote harvest rooms
			_.forEach(room.memory.rHarvestTargets , (rN) =>
			{
				needName = "rhaul." + rN;
				let numContainers = Room.getStructureIdsType(rN , STRUCTURE_CONTAINER).length;

				if (numContainers > 0)
				{
					if (lib.isNull(memory.needs[needName]))
					{
						memory.needs[needName] = {};
					}
					need = memory.needs[needName];
					need.name = needName;
					need.type = "needRHaul";
					need.targetRoom = rN;
					need.priority = C.PRIORITY_3;
					need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
				}
				else
				{
					delete memory.needs[needName];
				}
			});
		}
		else // no storage in room
		{
			// cull all needs
			memory.needs = {};
		}

	}
	// build haul needs for harvest room
	else if (room.isRHarvestTarget)
	{
		let targetRoomName = room.memory.rHarvestParents[0];
		storage = Room.getStructuresType(targetRoomName , STRUCTURE_STORAGE)[0];

		if (!lib.isNull(targetRoomName) && !lib.isNull(storage))
		{
			_.forEach(containers , container =>
			{
				needName = "haulContainer." + container.id;
				if (container.carrying > 1000)
				{
					// create new need if one doesn't exist
					if (lib.isNull(memory.needs[needName]))
					{
						memory.needs[needName] = {};
						need = memory.needs[needName];
						need.name = needName;
						need.type = "needHaul";
						need.sourceId = container.id;
						need.targetId = storage.id;
						need.priority = C.PRIORITY_1;
					}
					else
					{
						need = memory.needs[needName];
					}
				}
				else
				{
					delete memory.needs[needName];
				}
			});
		}
		else
		{
			memory.needs = {};
		}
	}
	else
	{
		memory.needs = {};
	}
};

/**
 * Export
 * @type {MotivationHaul}
 */
module.exports = new MotivationHaul();

