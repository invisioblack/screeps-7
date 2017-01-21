
//-------------------------------------------------------------------------
// needLongDistancePickup
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Need = require('Need.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
let NeedLongDistancePickup = function ()
{
	Need.call(this);
	this.name = "needLongDistancePickup";
};

NeedLongDistancePickup.prototype = Object.create(Need.prototype);
NeedLongDistancePickup.prototype.constructor = NeedLongDistancePickup;

NeedLongDistancePickup.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	memory.demands = {};

	if (roomManager.getIsLongDistanceHarvestTarget(roomName))
	{
		this.getUnitHaulToStorageDemand(roomName, "hauler", memory.demands);
	}
	else
	{
		this.getUnitHaulToStorageDemand(memory.targetRoom, "hauler", memory.demands);
	}

	//console.log(JSON.stringify(memory));
	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	//console.log("   workers: carry: " + workerCapacity + " demanded workers: " + result["worker"]);

	//console.log(`NeedTransferEnergy.prototype.getUnitDemands: ${motivationName}\t${JSON.stringify(result)}`);

	if (memory.demands["hauler"] > 1)
		memory.demands["hauler"];

	return memory.demands;
};


module.exports = new NeedLongDistancePickup();