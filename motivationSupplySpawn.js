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

MotivationSupplySpawn.prototype.getDemands = function (roomName, spawnEnergy, workers)
{
	var result = {};
	result.energy = spawnEnergy.energyCapacity - spawnEnergy.energy;
	result.workers = Math.floor(result.energy / 50);
	result.spawn = workers < result.workers;

	return result;
}

module.exports = new MotivationSupplySpawn();