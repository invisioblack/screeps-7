"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedHaul = function ()
{
	Need.call(this);
	this.name = "needHaul";
};

NeedHaul.prototype = Object.create(Need.prototype);
NeedHaul.prototype.constructor = NeedHaul;

NeedHaul.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	let container = Game.getObjectById(needMemory.sourceId);
	needMemory.demands = {};

	if (!lib.isNull(container) && container.carrying > 1000)
	{
		needMemory.demands["hauler"] = 1;
	}
	else
	{
		needMemory.demands["hauler"] = 0;
	}

	this.fillUnitDemands(needMemory.demands);

	return needMemory.demands;
};

module.exports = new NeedHaul();

