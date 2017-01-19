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

NeedLongDistanceHarvest.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let targetRoomMemory = Memory.rooms[memory.targetRoom];
	memory.demands = {};
	memory.demands["ldharvester"] = 0;

	if (!lib.isNull(targetRoomMemory)) {
		_.forEach(targetRoomMemory.motivations["motivationHarvestSource"].needs, (n) => {
			memory.demands["ldharvester"] += n.demands["ldharvester"];
		});
	}

	return memory.demands;
};


module.exports = new NeedLongDistanceHarvest();