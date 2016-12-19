//-------------------------------------------------------------------------
// needHarvestEnergy
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');
var resourceManager = require("resourceManager");

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
	var maxWorkers = 0;
	var creepsOnSource = resourceManager.countCreepsOnSource(roomName, memory.sourceId);
	var preResult = 0;

	if (lib.isNull(source.getMaxHarvesters))
		maxWorkers = 1;
	else
		maxWorkers = source.getMaxHarvesters();

	preResult = maxWorkers - creepsOnSource;
	if (preResult < 0)
		result["worker"] = 0;
	else
		result["worker"] = preResult;

	return result;
};


module.exports = new NeedHarvestEnergy();