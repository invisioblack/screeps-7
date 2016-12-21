//-------------------------------------------------------------------------
// needTransferEnergy
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
var NeedTransferEnergy = function ()
{
	Need.call(this);
	this.name = "needTransferEnergy";
};

NeedTransferEnergy.prototype = Object.create(Need.prototype);
NeedTransferEnergy.prototype.constructor = NeedTransferEnergy;

NeedTransferEnergy.prototype.getUnitDemands = function(roomName, memory)
{
	var result = {};
	var target = Game.getObjectById(memory.targetId);
	var energy, energyCapacity, neededEnergy;

	if (!lib.isNull(target.energy))
	{
		energyCapacity = target.energyCapacity;
		energy = target.energy;
	} else {
		energyCapacity = target.progressTotal;
		energy = target.progress;
	}

	neededEnergy = energyCapacity - energy;


	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	result["worker"] = Math.floor(neededEnergy / 50);

	return result;
};


module.exports = new NeedTransferEnergy();