"use strict";

let Need = require('Need.prototype')();

/**
 * NeedGarrison
 * @constructor
 */
let NeedGarrison = function ()
{
	Need.call(this);
	this.name = "needGarrison";
};

NeedGarrison.prototype = Object.create(Need.prototype);
NeedGarrison.prototype.constructor = NeedGarrison;

/**
 * getUnitDemands
 * @param roomName
 * @param needMemory
 * @param motivationName
 * @returns {{}|*}
 */
NeedGarrison.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	let unitCount = Room.getThreat(roomName).threats.length;

	needMemory.demands = {};
	needMemory.demands["guard"] = unitCount * 2;
	needMemory.demands["rangedGuard"] = unitCount * 2;
	needMemory.demands["heal"] = unitCount * 2;

	return needMemory.demands;
};

module.exports = new NeedGarrison();
