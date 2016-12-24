//-------------------------------------------------------------------------
// motivationSupplyTower
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');
var needTransferEnergy = require("needTransferEnergy");
var resourceManager = require("resourceManager");
var units = require("units");

// script prototypes
var Motivation = require('prototype.motivation')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
var MotivationSupplyTower = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplyTower";
	this.needs = {};
	this.needs["needTransferEnergy"] = needTransferEnergy;
};

MotivationSupplyTower.prototype = Object.create(Motivation.prototype);
MotivationSupplyTower.prototype.constructor = MotivationSupplyTower;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationSupplyTower.prototype.getDemands = function (roomName, resources)
{
	var result = {};
	var towers = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_TOWER}});

	var energy = _.sum(towers, "energy");
	var energyTotal = _.sum(towers, "energyCapacity");
	console.log("e: " + energy + " et: " + energyTotal);
	result.energy = energyTotal - energy;
	result.units = this.getUnitDemands(roomName);
	if (lib.isNull(result.units["worker"]))
		result.units["worker"] = 0;
	result.spawn = this.getDesireSpawn(roomName, result);
	console.log('  Supply Tower Demands: e: ' + result.energy + ' Workers: ' + result.units["worker"] + ' Spawn: ' + result.spawn);
	return result;
};

MotivationSupplyTower.prototype.getDesireSpawn = function (roomName, demands)
{
	var result = true;
	var memory = Game.rooms[roomName].memory.motivations[this.name];
	if (memory.active)
	{
		for (var unitName in units)
		{
			if (!lib.isNull(demands.units[unitName]) && demands.units[unitName] < resourceManager.countRoomUnits(roomName , unitName))
			{
				result = false;
			}
		}
	} else {
		result = false;
	}

	return result;
};

MotivationSupplyTower.prototype.getDesiredSpawnUnit = function ()
{
	return "worker";
};

MotivationSupplyTower.prototype.updateActive = function (roomName, demands)
{
	var memory = Game.rooms[roomName].memory.motivations[this.name];
	if (demands.energy > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationSupplyTower.prototype.updateNeeds = function (roomName)
{
	var room = Game.rooms[roomName];
	var memory = room.memory.motivations[this.name];
	var sortedNeedsByDistance, x;
	var towers = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_TOWER}});

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// towers ----------------------------------------------------------------------------------------------------------

	towers.forEach(function (tower){
		//console.log(towers);
		// loop over spawns in room
		if (tower.room.name == roomName)
		{
			var needName = "supplyTower." + tower.id;
			var need;

			//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

			// create needs if we need energy, cull needs if not
			if ((tower.energyCapacity - tower.energy) > 0)
			{
				// create new need if one doesn't exist
				if (lib.isNull(memory.needs[needName]))
				{
					memory.needs[needName] = {};
					need = memory.needs[needName];
					need.type = "needTransferEnergy";
					need.name = needName;
					need.targetId = tower.id;
					need.priority = C.PRIORITY_2;
				}
			} else { // cull need if we don't need energy
				delete memory.needs[needName];
			}
		}
	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplyTower();