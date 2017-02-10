"use strict";
let Motivation = require('Motivation.prototype')();

/**
 * MotivationHarvest
 * @constructor
 */
let MotivationHarvest = function ()
{
	Motivation.call(this);
	this.name = "motivationHarvest";
};

MotivationHarvest.prototype = Object.create(Motivation.prototype);
MotivationHarvest.prototype.constructor = MotivationHarvest;

/**
 * getDesiredSpawnUnit
 * @param roomName
 * @param unitDemands
 * @returns {*}
 */
MotivationHarvest.prototype.getDesiredSpawnUnit = function (roomName , unitDemands)
{
	let numHarv = Room.countHomeRoomUnits(roomName , "harvester");

	if (numHarv < unitDemands["harvester"])
	{
		return "harvester";
	}
	else
	{
		return "rharvester";
	}
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationHarvest.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if (room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
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
 *
 * @returns {[string,string]}
 */
MotivationHarvest.prototype.getAssignableUnitNames = function ()
{
	return ["harvester" , "rharvester"];
};

/**
 *
 * @param roomName
 */
MotivationHarvest.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let need , needName , sources , containers , container , extractor , mineral;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// if the room doesn't have containers, we don't even try
	if (room.energyPickupMode < C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
	{
		memory.needs = {};
		return;
	}

	// build needs to harvest sources
	sources = Room.getSources(roomName);
	containers = Room.getStructuresType(roomName , STRUCTURE_CONTAINER);
	sources.forEach(function (s)
	{
		needName = "harvest." + s.id;
		container = s.pos.findInRange(containers , 1)[0];

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHarvestSource";
			need.targetId = s.id;
			if (!lib.isNull(container))
			{
				need.containerId = container.id;
			}
			else
			{
				need.containerId = "";
			}
			need.priority = C.PRIORITY_1;
			need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
		}
		else
		{
			need = memory.needs[needName];
		}

		container = Game.getObjectById(memory.needs[needName].containerId);
		if (room.energyPickupMode === C.ROOM_ENERGYPICKUPMODE_LINK && !lib.isNull(container) && lib.isNull(need.linkId))
		{
			let links = Room.getStructuresType(roomName, STRUCTURE_LINK);
			let link = container.pos.findInRange(links , 1)[0];
			if (!lib.isNull(link))
			{
				need.linkId = link.id;
			}
		}

		// cull need is container is missing
		if (lib.isNull(container))
		{
			delete memory.needs[needName];
		}
	} , this);

	// build needs to harvest minerals
	extractor = Room.getStructuresType(roomName , STRUCTURE_EXTRACTOR)[0];

	if (lib.isNull(room.memory.mineralId))
	{
		mineral = Game.getObjectById(room.memory.mineralId);
	}

	if (lib.isNull(mineral))
	{
		mineral = room.find(FIND_MINERALS , 1)[0];
		room.memory.mineralId = mineral.id;
	}
	needName = "harvestMinerals." + roomName;

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]) && !lib.isNull(extractor))
	{
		let container = extractor.pos.findInRange(containers , 1)[0];
		room.memory.mineralContainerId = container.id;
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needHarvestMinerals";
		need.targetId = mineral.id;
		if (!lib.isNull(container))
		{
			need.containerId = container.id;
		}
		else
		{
			need.containerId = "";
		}
		need.priority = C.PRIORITY_3;
		need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
	}

	// cull need if it is not needed
	if (lib.isNull(extractor) || lib.isNull(mineral) || mineral.amount < 1)
	{
		delete memory.needs[needName];
	}

	// build remote harvest needs
	_.forEach(room.memory.rHarvestTargets , (rN) =>
	{
		if (_.has(Memory, `rooms[${rN}].motivations["motivationHarvest"]`))
		{
			_.forEach(Memory.rooms[rN].motivations["motivationHarvest"].needs, (rNeed, rNeedName) =>
			{
				needName = "rHarvest." + rNeed.targetId;

				// create new need if one doesn't exist
				if (lib.isNull(memory.needs[needName]))
				{
					memory.needs[needName] = {};
					need = memory.needs[needName];
					need.name = needName;
					need.type = "needRHarvest";
					need.targetRoom = rN;
					need.priority = C.PRIORITY_3;
					need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
					need.rMotive = {
						motivation: "motivationHarvest",
						need: rNeedName
					}
				}
			});
		}
		else
		{
			// cull unneeded remote harvest needs
			_.forEach(memory.needs , (v , k) =>
			{
				if (v.type === "needRHarvest" && v.targetRoom === rN)
				{
					delete memory.needs[k];
				}
			});
		}
	});

	// cull unneeded remote harvest needs
	_.forEach(memory.needs , (v , k) =>
	{
		if (v.type === "needRHarvest" && !_.some(room.memory.rHarvestTargets , o => v.targetRoom === o))
		{
			delete memory.needs[k];
		}
	});
};

/**
 * Export
 * @type {MotivationHarvest}
 */
module.exports = new MotivationHarvest();