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

NeedRHaul.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	needMemory.demands = {};
	needMemory.demands["hauler"] = global["motivationHaul"].getDemands(needMemory.targetRoom).units["hauler"];
	needMemory.demands["hauler"] -= Room.countMotivationUnits(needMemory.targetRoom, "motivationHaul", "hauler");

	this.fillUnitDemands(needMemory.demands);

	return needMemory.demands;
};

module.exports = new NeedRHaul();


