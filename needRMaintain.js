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

NeedRMaintain.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{

	needMemory.demands = {};
	if (_.has(Memory, `rooms[${needMemory.targetRoom}].motivations["motivationMaintain"]`))
	{
		let numRWorkers = Room.countUnits(needMemory.targetRoom , "worker");
		let demandedWorkers = global["motivationMaintain"].getDemands(needMemory.targetRoom).units["worker"];

		if (numRWorkers === 0 && demandedWorkers > 0)
		{
			needMemory.demands["worker"] = 1;
		}
	}
	this.fillUnitDemands(needMemory.demands);

	return needMemory.demands;
};

module.exports = new NeedRMaintain();


