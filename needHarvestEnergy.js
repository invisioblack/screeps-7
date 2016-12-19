//-------------------------------------------------------------------------
// needHarvestEnergy
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');

// script prototypes
var Need = require('prototype.need')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
var NeedHarvestEnergy = function ()
{
	Need.call(this);
	this.name = "needHarvestEnergy";
};

NeedHarvestEnergy.prototype = Object.create(Need.prototype);
NeedHarvestEnergy.prototype.constructor = NeedHarvestEnergy;

NeedHarvestEnergy.prototype.getUnitDemands = function(roomName, memory)
{
	var result = {};
	var source = Game.getObjectById(memory.sourceId);
	var maxWorkers = source.getMaxHarvesters();
	maxWorkers = maxWorkers + Math.ceil(maxWorkers * 0.5);
	result["worker"] = maxWorkers;

	return result;
};


module.exports = new NeedHarvestEnergy();