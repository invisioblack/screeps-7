//-------------------------------------------------------------------------
// needLongDistanceHarvest
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Need = require('Need.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
let NeedLongDistanceHarvest = function ()
{
	Need.call(this);
	this.name = "needLongDistanceHarvest";
};

NeedLongDistanceHarvest.prototype = Object.create(Need.prototype);
NeedLongDistanceHarvest.prototype.constructor = NeedLongDistanceHarvest;

NeedLongDistanceHarvest.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	// Validation
	if (lib.isNull(needMemory))
	{
		return;
	}
	if (lib.isNull(Memory.rooms[needMemory.targetRoom]))
	{
		return;
	}

	// implementation
	let targetRoomMemory = Memory.rooms[needMemory.targetRoom];
	needMemory.demands = {};
	needMemory.demands["ldharvester"] = 0;

	if (!lib.isNull(targetRoomMemory) && !lib.isNull(targetRoomMemory.motivations) && !lib.isNull(targetRoomMemory.motivations["motivationHarvestSource"]) && !lib.isNull(targetRoomMemory.motivations["motivationHarvestSource"].demands))
	{
		needMemory.demands["ldharvester"] = lib.nullProtect(targetRoomMemory.motivations["motivationHarvestSource"].demands.units["ldharvester"] , 0);
	}
	else
	{
		needMemory.demands["ldharvester"] = 0;
	}

	if (!lib.isNull(targetRoomMemory) && !lib.isNull(targetRoomMemory.motivations) && !lib.isNull(targetRoomMemory.motivations["motivationMaintainInfrastructure"]) && !lib.isNull(targetRoomMemory.motivations["motivationHarvestSource"].demands))
	{
		let numWorkers = Room.countUnits(needMemory.targetRoom , "worker");
		needMemory.demands["worker"] = lib.clamp(lib.nullProtect(targetRoomMemory.motivations["motivationMaintainInfrastructure"].demands.units["worker"] , 0), 0, 1);
		needMemory.demands["worker"] -= numWorkers;
	}
	else
	{
		needMemory.demands["worker"] = 0;
	}

	return needMemory.demands;
};

module.exports = new NeedLongDistanceHarvest();