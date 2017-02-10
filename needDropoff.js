"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedDropoff = function ()
{
	Need.call(this);
	this.name = "needDropoff";
};

NeedDropoff.prototype = Object.create(Need.prototype);
NeedDropoff.prototype.constructor = NeedDropoff;

NeedDropoff.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	needMemory.demands = {};
	this.fillUnitDemands(needMemory.demands);

	return needMemory.demands;
};

module.exports = new NeedDropoff();


