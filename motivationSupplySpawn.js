//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');

// script prototypes
var Motivation = require('prototype.motivation')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
var MotivationSupplySpawn = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplySpawn";
	this.priority = C.PRIORITY_1;
};

MotivationSupplySpawn.prototype = Object.create(Motivation.prototype);
MotivationSupplySpawn.prototype.constructor = MotivationSupplySpawn;

MotivationSupplySpawn.prototype.getDemands = function (roomName, resources)
{
	var result = {};
	result.energy = resources.spawnEnergy.energyCapacity - resources.spawnEnergy.energy;
	result.workers = Math.floor(result.energy / 50); // this will need to ask the needs what units it wants, needs to be refactors to demand any unit
	result.spawn = resources.units["worker"].total < result.workers;
	console.log('Supply Spawn Demands: e: ' + result.energy + ' Workers: ' + result.workers + ' Spawn: ' + result.spawn);
	return result;
};

MotivationSupplySpawn.prototype.updateNeeds = function (roomName)
{
	var room = Game.rooms[roomName];
	var memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// Handle Harvest Energy Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	var sources = room.find(FIND_SOURCES);
	sources.forEach(function (s)
	{
		var source = Game.getObjectById(s.id);
		var maxHarvesters = source.getMaxHarvesters(); // TODO: will need to use maxHarvesters - allocatedHarvesters when implemented
		var allocatedHarvesters = 0; // need to read this
		var availableHarvesters = maxHarvesters - allocatedHarvesters;
		console.log('Source: ' + s.id + ' Max Harvesters: ' + maxHarvesters);

		// create or confirm 1 harvest energy need for each, closest source higher priority
		var needName = "harvest." + s.id;
		var need;

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.type = "needHarvestEnergy";
			need.sourceId = s.id;
			need.targetId = room.controller;
			need.unitDemands = {};
			need.unitDemands["worker"] = availableHarvesters; // TODO: Unit demands should be driven by the need
			need.allocatedCreeps = {};
		}
		else
		{
			need = memory.needs[needName];
		}

		// update unitDemands
		need.unitDemands["worker"] = availableHarvesters;

		// remove allocated creeps from unit demands
		for (var creepName in need.allocatedCreeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.memory.type == "worker")
			{
				need.unitDemands["worker"]--;
			}
		}
	} , this);
};

MotivationSupplySpawn.prototype.desiredSpawnUnit = function ()
{
	return "worker";
};


module.exports = new MotivationSupplySpawn();