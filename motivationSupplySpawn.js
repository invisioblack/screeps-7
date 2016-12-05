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

	return result;
};

module.exports = new MotivationSupplySpawn();