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
MotivationHarvestSource.prototype.getDemands = function (roomName, resources) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//console.log(JSON.stringify(result.units));
	lib.log("  Harvest Source Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHarvestSource.prototype.getDesiredSpawnUnit = function (roomName)
{
	let unitName = "";
	let room = Game.rooms[roomName];
	if (!lib.isNull(room) && room.getIsMine())
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
	let numContainers = lib.nullProtect(roomMemory.cache.structures[STRUCTURE_CONTAINER], []).length;
	let numHarvesters = _.has(global, "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName].length : 0;
		//creepManager.countRoomUnits(roomName, "harvester");
	let demandedHarvesters = lib.nullProtect(demands.units[unitName], 0);
	let numWorkers = _.has(global, "cache.rooms." + roomName + ".units.worker") ? global.cache.rooms[roomName].units["worker"].length : 0;
	let critWorkers = config.critWorkers;

	// if we not in one of my owned rooms then we don't need to respect the crit workers limitation
	if (lib.isNull(room) || !room.getIsMine())
	{
		critWorkers = 0;
	}

	if (numContainers === 0 || numHarvesters >= demandedHarvesters || numWorkers < critWorkers)
	{
		result = false;
	}

	lib.log(`Room: ${roomName} Desire Spawn: ${result} Unit: ${unitName} #Containers: ${numContainers} Demanded Harvesters: ${demandedHarvesters}/${numHarvesters} Workers: ${numWorkers}/${critWorkers}`, debug);

	return result;
};

MotivationHarvestSource.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if (room.memory.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
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
	if (room.memory.cache.structures[STRUCTURE_CONTAINER].length === 0)
		return;

	sources.forEach(function (s) {
		let needName = "harvest." + s.id;
		let need;

		//console.log('Need Name: ' + needName);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			let container = s.pos.findInRange(FIND_STRUCTURES, 1,{ filter: function (s) { return s.structureType === STRUCTURE_CONTAINER; }})[0];
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

			let link = container.pos.findInRange(FIND_STRUCTURES, 1,{ filter: function (s) { return s.structureType === STRUCTURE_LINK; }})[0];
			if (!lib.isNull(link)) {
				need.linkId = link.id;
			}
		}

		if (lib.isNull(container))
		{
			delete memory.needs[needName];
		}
	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHarvestSource();