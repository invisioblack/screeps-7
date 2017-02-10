"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedRGarrison = function ()
{
	Need.call(this);
	this.name = "needRGarrison";
};

NeedRGarrison.prototype = Object.create(Need.prototype);
NeedRGarrison.prototype.constructor = NeedRGarrison;

NeedRGarrison.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	needMemory.demands = {};
	needMemory.demands["guard"] = global["motivationDefense"].getDemands(needMemory.targetRoom).units["guard"];
	needMemory.demands["guard"] -= Room.countUnits(needMemory.targetRoom, "guard");

	this.fillUnitDemands(needMemory.demands);

	return needMemory.demands;
};

module.exports = new NeedRGarrison();