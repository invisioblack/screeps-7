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
let NeedHaulMinerals = function ()
{
	Need.call(this);
	this.name = "needHaulMinerals";
};

NeedHaulMinerals.prototype = Object.create(Need.prototype);
NeedHaulMinerals.prototype.constructor = NeedHaulMinerals;

NeedHaulMinerals.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};
	memory.demands["hauler"] = 1;

	//console.log(JSON.stringify(memory));
	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	//console.log("   workers: carry: " + workerCapacity + " demanded workers: " + result["worker"]);

	//console.log(`NeedTransferEnergy.prototype.getUnitDemands: ${motivationName}\t${JSON.stringify(result)}`);

	return memory.demands;
};

module.exports = new NeedHaulMinerals();