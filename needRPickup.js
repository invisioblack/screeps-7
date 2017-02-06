"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedRPickup = function ()
{
	Need.call(this);
	this.name = "needRPickup";
};

NeedRPickup.prototype = Object.create(Need.prototype);
NeedRPickup.prototype.constructor = NeedRPickup;

NeedRPickup.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};
	memory.demands["hauler"] = global["motivationHaul"].getDemands(memory.targetRoom);
	memory.demands["hauler"] -= Room.countMotivationUnits(memory.targetRoom, "motivationHaul", "hauler");

	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedRPickup();


