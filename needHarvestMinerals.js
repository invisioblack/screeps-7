"use strict";

let Need = require('Need.prototype')();

/**
 * NeedHarvestMinerals
 * @constructor
 */
let NeedHarvestMinerals = function ()
{
	Need.call(this);
	this.name = "needHarvestSource";
};

NeedHarvestMinerals.prototype = Object.create(Need.prototype);
NeedHarvestMinerals.prototype.constructor = NeedHarvestMinerals;

/**
 * getUnitDemands
 * @param roomName
 * @param needMemory
 * @param motivationName
 * @returns {{}|*}
 */
NeedHarvestMinerals.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	needMemory.demands = {};
	needMemory.demands["harvester"] = 1;
	return needMemory.demands;
};

module.exports = new NeedHarvestMinerals();
