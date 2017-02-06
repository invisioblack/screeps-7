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

NeedHaul.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};
	memory.demands["hauler"] = 1;

	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedHaul();

