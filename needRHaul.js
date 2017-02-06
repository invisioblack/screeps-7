"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedRHaul = function ()
{
	Need.call(this);
	this.name = "needRHaul";
};

NeedRHaul.prototype = Object.create(Need.prototype);
NeedRHaul.prototype.constructor = NeedRHaul;

NeedRHaul.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};
	memory.demands["hauler"] = global["motivationHaul"].getDemands(memory.targetRoom);
	memory.demands["hauler"] -= Room.countMotivationUnits(memory.targetRoom, "motivationHaul", "hauler");

	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedRHaul();


