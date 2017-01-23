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

NeedLongDistanceHarvest.prototype.getUnitDemands = function(roomName, needMemory, motivationName)
{
	// Validation
	if (lib.isNull(needMemory))
		return;
	if (lib.isNull(Memory.rooms[needMemory.targetRoom]))
		return;

	// implementation
	let targetRoomMemory = Memory.rooms[needMemory.targetRoom];
	needMemory.demands = {};
	needMemory.demands["ldharvester"] = 0;

	if (!lib.isNull(targetRoomMemory) && !lib.isNull(targetRoomMemory.motivations) && !lib.isNull(targetRoomMemory.motivations["motivationHarvestSource"])) {
		//console.log();
		needMemory.demands["ldharvester"] = lib.nullProtect(targetRoomMemory.motivations["motivationHarvestSource"].demands.units["ldharvester"], 0);
	}

	//console.log(`${roomName} ${JSON.stringify(needMemory.demands)}`);
	return needMemory.demands;
};


module.exports = new NeedLongDistanceHarvest();