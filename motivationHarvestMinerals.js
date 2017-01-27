//----------------------------------------------------------------------------------------------------------------------
// motivationSupplyController
//-------------------------------------------------------------------------
"use strict";
let Motivation = require('Motivation.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationHarvestMinerals = function ()
{
	Motivation.call(this);
	this.name = "motivationHarvestMinerals";
};

MotivationHarvestMinerals.prototype = Object.create(Motivation.prototype);
MotivationHarvestMinerals.prototype.constructor = MotivationHarvestMinerals;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationHarvestMinerals.prototype.getDemands = function (roomName) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log("  Harvest Minerals Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHarvestMinerals.prototype.getDesiredSpawnUnit = function (roomName)
{
	let unitName = "";
	let room = Game.rooms[roomName];
	if (!lib.isNull(room) && room.getIsMine())
		unitName = "harvester";
	else
		unitName = "ldharvester";

	return unitName;
};

MotivationHarvestMinerals.prototype.getDesireSpawn = function (roomName, demands)
{
	let debug = false;
	let result = true;
	let room = Game.rooms[roomName];
	let roomMemory = Memory.rooms[roomName];
	let unitName = this.getDesiredSpawnUnit(roomName);
	let numHarvesters = 0;
	let numContainers = lib.nullProtect(roomMemory.cache.structures[STRUCTURE_CONTAINER], []).length;
	let demandedHarvesters = lib.nullProtect(demands.units[unitName], 0);

	// if we not in one of my owned rooms then check for assigned to the room so we don't double spawn
	if (lib.isNull(room) || !room.getIsMine())
	{
	    numHarvesters = creepManager.countRoomUnits(roomName, unitName);
	} else {
	    numHarvesters = creepManager.countRoomMotivationUnits(roomName, "motivationHarvestSource", unitName);
	}
	    
	if (numContainers === 0 || numHarvesters >= demandedHarvesters)
	{
		result = false;
	}

	lib.log(`Room: ${roomName} Desire Spawn: ${result} Unit: ${unitName} #PickUp: ${roomMemory.energyPickupMode} Demanded Harvesters: ${demandedHarvesters}/${numHarvesters}`, debug);

	return result;
};

MotivationHarvestMinerals.prototype.getAssignableUnitNames = function ()
{
	return ["harvester", "ldharvester"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationHarvestMinerals.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numContainers = lib.nullProtect(room.memory.cache.structures[STRUCTURE_CONTAINER], []).length;
	let numExtrators = lib.nullProtect(room.memory.cache.structures[STRUCTURE_EXTRACTOR], []).length;
	let numSources = room.memory.cache.sources.length;

	if (numContainers > numSources && numExtrators > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationHarvestMinerals.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// build Needs -------------------------------------------------------------------------------------
	let extractorIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_EXTRACTOR], []);
	let extractors = _.map(extractorIds, (id) => { return Game.getObjectById(id) });

	// if the room doesn't have containers, we don't even try
	if (room.memory.cache.structures[STRUCTURE_CONTAINER].length === 0)
	{
	    memory.needs = {};
		return;
	}

	extractors.forEach(function (s) {
		let needName = "harvestMinerals." + s.id;
		let need;

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			let containers = _.map(room.memory.cache.structures[STRUCTURE_CONTAINER], (o) => { return Game.getObjectById(o); });
			let container = s.pos.findInRange(containers, 1)[0];
			let mineral = s.pos.findInRange(FIND_MINERALS, 1)[0];
			room.memory.mineralContainerId = container.id;
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHarvestMinerals";
			need.targetId = mineral.id;
			if (!lib.isNull(container))
			{
				need.containerId = container.id;
			} else {
				need.containerId = "";
			}
			need.priority = C.PRIORITY_1;

		}

        // cull need if the container is gone
		let container = Game.getObjectById(memory.needs[needName].containerId);
		if (lib.isNull(container))
		{
			delete memory.needs[needName];
		}
	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHarvestMinerals();