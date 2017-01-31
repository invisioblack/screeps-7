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
let MotivationHarvestSource = function ()
{
	Motivation.call(this);
	this.name = "motivationHarvestSource";
};

MotivationHarvestSource.prototype = Object.create(Motivation.prototype);
MotivationHarvestSource.prototype.constructor = MotivationHarvestSource;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationHarvestSource.prototype.getDemands = function (roomName) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log("Room: " + roomName + "  Harvest Source Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHarvestSource.prototype.getDesiredSpawnUnit = function (roomName)
{
	let unitName = "";
	let room = Game.rooms[roomName];
	if (!lib.isNull(room) && room.isMine)
		unitName = "harvester";
	else
		unitName = "ldharvester";

	return unitName;
};

MotivationHarvestSource.prototype.getDesireSpawn = function (roomName, demands)
{
	let debug = false;
	let result = true;
	let room = Game.rooms[roomName];
	let roomMemory = Memory.rooms[roomName];
	let unitName = this.getDesiredSpawnUnit(roomName);
	let numHarvesters = 0;
	let demandedHarvesters = lib.nullProtect(demands.units[unitName], 0);

	lib.log(roomMemory.mode, debug);

	if (roomMemory.mode < C.ROOM_MODE_NORMAL && roomMemory.mode !== C.ROOM_MODE_REMOTE_HARVEST)
	{
		return false;
	}

	// if we not in one of my owned rooms then check for assigned to the room so we don't double spawn
	if (lib.isNull(room) || !room.isMine)
	{
		numHarvesters = Room.countUnits(roomName, unitName);
	} else {
	    numHarvesters = Room.countMotivationUnits(roomName, "motivationHarvestSource", unitName);
	}

	if (roomMemory.energyPickupMode < C.ROOM_ENERGYPICKUPMODE_PRECONTAINER || numHarvesters >= demandedHarvesters)
	{
		result = false;
	}

	lib.log(`Room: ${roomLink(roomName)} Desire Spawn: ${result} Unit: ${unitName} #Pickup: ${roomMemory.energyPickupMode} Demanded Harvesters: ${demandedHarvesters}/${numHarvesters}`, debug);

	return result;
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationHarvestSource.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if (room.memory.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
	{
		memory.active = true;
	} else {
		memory.active = false;
		memory.demands.spawn = false;
		memory.spawnAllocated = false;
	}
};

MotivationHarvestSource.prototype.getAssignableUnitNames = function ()
{
	return ["harvester", "ldharvester"];
};

MotivationHarvestSource.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// Handle Harvest Energy Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let sourceIds = lib.nullProtect(room.memory.cache.sources, []);
	let sources = _.map(sourceIds, (id) => { return Game.getObjectById(id) });

	// if the room doesn't have containers, we don't even try
	if (room.memory.energyPickupMode < C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
	{
		memory.needs = {};
		return;
	}

	sources.forEach(function (s) {
		let needName = "harvest." + s.id;
		let need;

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			let containers = Room.getStructuresType(roomName, STRUCTURE_CONTAINER);
			let container = s.pos.findInRange(containers, 1)[0];
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHarvestSource";
			need.targetId = s.id;
			if (!lib.isNull(container))
			{
				need.containerId = container.id;
			} else {
				need.containerId = "";
			}
			need.priority = C.PRIORITY_1;
		} else {
			need = memory.needs[needName];
		}

		let container = Game.getObjectById(memory.needs[needName].containerId);
		if (room.memory.energyPickupMode === C.ROOM_ENERGYPICKUPMODE_LINK && !lib.isNull(container) && lib.isNull(need.linkId))
		{

			let links = _.map(room.memory.cache.structures[STRUCTURE_LINK], (id) => { return Game.getObjectById(id); });
			let link = container.pos.findInRange(links, 1)[0];
			if (!lib.isNull(link)) {
				need.linkId = link.id;
			}
		}

        // cull need is container is missing
		if (lib.isNull(container))
		{
			delete memory.needs[needName];
		}
	}, this);
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 * properties
 */

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHarvestSource();