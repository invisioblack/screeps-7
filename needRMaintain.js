"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedRMaintain = function ()
{
	Need.call(this);
	this.name = "NeedRMaintain";
};

NeedRMaintain.prototype = Object.create(Need.prototype);
NeedRMaintain.prototype.constructor = NeedRMaintain;

NeedRMaintain.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	let numRWorkers = Room.countUnits(memory.targetRoom, "worker");
	let demandedWorkers = global["motivationMaintain"].getDemands(memory.targetRoom).units["worker"];

	memory.demands = {};
	if (numRWorkers === 0 && demandedWorkers > 0)
	{
		memory.demands["worker"] = 1;
	}

	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedRMaintain();


