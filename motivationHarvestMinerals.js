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
MotivationHarvestMinerals.prototype.getDemands = function (roomName, resources) {
	let debug = false;
	let result = {};
	//let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//console.log(JSON.stringify(result.units));
	//lib.log("  Harvest Minerals Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
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
	let numContainers = lib.nullProtect(roomMemory.cache.structures[STRUCTURE_CONTAINER], []).length;
	let numHarvesters = 0;
	let demandedHarvesters = lib.nullProtect(demands.units[unitName], 0);
	let numWorkers = creepManager.countRoomUnits(roomName, "worker");
	let critWorkers = config.critWorkers;

    // if we not in one of my owned rooms then we don't need to respect the crit workers limitation
	if (lib.isNull(room) || !room.getIsMine())
	{
	    numHarvesters = creepManager.countRoomUnits(roomName, unitName);
		critWorkers = 0;
	} else {
	    numHarvesters = creepManager.countRoomMotivationUnits(roomName, "motivationHarvestSource", unitName);
	}
	    

	if (numContainers === 0 || numHarvesters >= demandedHarvesters || numWorkers < critWorkers)
	{
		result = false;
	}

	lib.log(`Room: ${roomName} Desire Spawn: ${result} Unit: ${unitName} #Containers: ${numContainers} Demanded Harvesters: ${demandedHarvesters}/${numHarvesters} Workers: ${numWorkers}/${critWorkers}`, debug);

	return result;
};

MotivationHarvestMinerals.prototype.updateActive = function (roomName, demands)
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
	let extrators = _.map(extractorIds, (id) => { return Game.getObjectById(id) });

	// if the room doesn't have containers, we don't even try
	if (room.memory.cache.structures[STRUCTURE_CONTAINER].length === 0)
		return;

	extrators.forEach(function (s) {
		let needName = "harvestMinerals." + s.id;
		let need;
		//console.log('Need Name: ' + needName);

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

		} else {
			need = memory.needs[needName];
		}

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