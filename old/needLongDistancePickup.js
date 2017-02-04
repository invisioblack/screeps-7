//-------------------------------------------------------------------------
// needLongDistancePickup
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
let NeedLongDistancePickup = function ()
{
	Need.call(this);
	this.name = "needLongDistancePickup";
};

NeedLongDistancePickup.prototype = Object.create(Need.prototype);
NeedLongDistancePickup.prototype.constructor = NeedLongDistancePickup;

NeedLongDistancePickup.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};

	if (Room.getIsLongDistanceHarvestTarget(roomName))
	{
		this.getUnitHaulToStorageDemand(roomName , "hauler" , memory.demands);
	}
	else
	{
		this.getUnitHaulToStorageDemand(memory.targetRoom , "hauler" , memory.demands);
	}

	return memory.demands;
};

module.exports = new NeedLongDistancePickup();