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
	needMemory.demands = {};
	needMemory.demands["rharvester"] = 0;

	if (_.has(Memory, `rooms[${needMemory.targetRoom}].motivations["motivationHarvest"].needs`))
	{

		let rNeeds = Memory.rooms[needMemory.targetRoom].motivations["motivationHarvest"].needs;

		if (!lib.isNull(rNeeds) && !lib.isNull(needMemory.rMotive) && !lib.isNull(rNeeds[needMemory.rMotive.need]))
		{

			needMemory.demands["rharvester"] = global["needHarvestSource"].getUnitDemands(needMemory.targetRoom, rNeeds[needMemory.rMotive.need], "motivationHarvest")["rharvester"];
			needMemory.demands["rharvester"] -= Room.countMotivationNeedUnits(needMemory.targetRoom , "motivationHarvest", needMemory.rMotive.need , "rharvester");
		}
		else
		{
			needMemory.demands["rharvester"] = 0;
		}
	}
	else
	{
		needMemory.demands["rharvester"] = 0;
	}

	return needMemory.demands;
};


module.exports = new NeedRHarvest();