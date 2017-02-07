"use strict";

let Need = require('Need.prototype')();

/**
 * 
 * @constructor
 */
let NeedRHarvest = function ()
{
	Need.call(this);
	this.name = "needRHarvest";
};

NeedRHarvest.prototype = Object.create(Need.prototype);
NeedRHarvest.prototype.constructor = NeedRHarvest;

NeedRHarvest.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	// Validation
	if (lib.isNull(needMemory))
	{
		return null;
	}
	if (lib.isNull(Memory.rooms[needMemory.targetRoom]))
	{
		return null;
	}

	// implementation
	let targetRoomMemory = Memory.rooms[needMemory.targetRoom];
	needMemory.demands = {};
	needMemory.demands["rharvester"] = 0;

	if (!lib.isNull(targetRoomMemory) && !lib.isNull(targetRoomMemory.motivations) && !lib.isNull(targetRoomMemory.motivations["motivationHarvest"]))
	{
		needMemory.demands["rharvester"] = global["motivationHarvest"].getDemands(needMemory.targetRoom).units["rharvester"];
		needMemory.demands["rharvester"] -= Room.countMotivationUnits(needMemory.targetRoom, "motivationHarvest", "rharvester");
	}
	else
	{
		needMemory.demands["rharvester"] = 0;
	}

	return needMemory.demands;
};

module.exports = new NeedRHarvest();