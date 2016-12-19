//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');
var needHarvestEnergy = require("needHarvestEnergy");

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
	this.needs = {};
	this.needs["needHarvestEnergy"] = needHarvestEnergy;
};

MotivationSupplySpawn.prototype = Object.create(Motivation.prototype);
MotivationSupplySpawn.prototype.constructor = MotivationSupplySpawn;

MotivationSupplySpawn.prototype.getDemands = function (roomName, resources)
{
	var result = {};
	result.energy = resources.spawnEnergy.energyCapacity - resources.spawnEnergy.energy;
	result.units = this.getUnitDemands(roomName);
	result.spawn = resources.units["worker"].allocated < result.units["worker"];
	console.log('Supply Spawn Demands: e: ' + result.energy + ' Workers: ' + result.units["worker"] + ' Spawn: ' + result.spawn);
	return result;
};

// TODO: This needs to be reworked to produce 1 need per spawn, and per extension
MotivationSupplySpawn.prototype.updateNeeds = function (roomName)
{
	var room = Game.rooms[roomName];
	var memory = room.memory.motivations[this.name];
	var sortedNeedsByDistance, x;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// spawns ----------------------------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	for (var spawnName in Game.spawns)
	{
		// loop over spawns in room
		var spawn = Game.spawns[spawnName];
		if (spawn.room.name == roomName)
		{
			// create a need for each source in the room
			var sources = room.find(FIND_SOURCES);
			sources.forEach(function (s)
			{
				var needName = "harvest." + s.id + "." + spawn.id;
				var need;

				//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

				// create needs if we need energy, cull needs if not
				if ((spawn.energyCapacity - spawn.energy) > 0)
				{
					// create new need if one doesn't exist
					if (lib.isNull(memory.needs[needName]))
					{
						memory.needs[needName] = {};
						need = memory.needs[needName];
						need.type = "needHarvestEnergy";
						need.name = needName;
						need.sourceId = s.id;
						need.targetId = spawn.id;
						need.distance = room.findPath(s.pos , room.controller.pos).length;
						need.priority = C.PRIORITY_2;
					}
					else
					{
						need = memory.needs[needName];
					}
				} else { // cull need if we don't need energy
					delete memory.needs[needName];
				}


			} , this);
		}
	}

	// extenders -------------------------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	var extenders = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
	extenders.forEach(function (ex) {
		// create a need for each source in the room
		var sources = room.find(FIND_SOURCES);
		sources.forEach(function (s)
		{
			var needName = "harvest." + s.id + "." + ex.id;
			var need;

			//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

			if ((ex.energyCapacity - ex.energy) > 0)
			{
				// create new need if one doesn't exist
				if (lib.isNull(memory.needs[needName]))
				{
					memory.needs[needName] = {};
					need = memory.needs[needName];
					need.type = "needHarvestEnergy";
					need.name = needName;
					need.sourceId = s.id;
					need.targetId = ex.id;
					need.distance = room.findPath(s.pos , room.controller.pos).length;
					need.priority = C.PRIORITY_5;
				}
				else
				{
					need = memory.needs[needName];
				}
			} else { // cull need if we don't need energy
				delete memory.needs[needName];
			}
		}, this);
	}, this);
};

MotivationSupplySpawn.prototype.desiredSpawnUnit = function ()
{
	return "worker";
};


module.exports = new MotivationSupplySpawn();