//-------------------------------------------------------------------------
// needHarvestSource
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
let NeedHarvestSource = function ()
{
	Need.call(this);
	this.name = "needHarvestSource";
};

NeedHarvestSource.prototype = Object.create(Need.prototype);
NeedHarvestSource.prototype.constructor = NeedHarvestSource;

NeedHarvestSource.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let unitName = "";
	let room = Game.rooms[roomName];
	let ticksTillHarvesterDeath = this.getTicksTillHarvesterDeath(roomName, memory);

	if (!lib.isNull(room) && room.getIsMine())
		unitName = "harvester";
	else
		unitName = "ldharvester";
	// ---------------------------------------------------
	memory.demands = {};
	memory.demands[unitName] = 1;

	if (ticksTillHarvesterDeath != 0 && ticksTillHarvesterDeath < config.harvesterPrespawnTicks)
	{
		memory.demands[unitName] = 2;
	}
	return memory.demands;
};

NeedHarvestSource.prototype.getTicksTillHarvesterDeath = function (roomName, memory)
{
	let unitName = "";
	let room = Game.rooms[roomName];
	if (!lib.isNull(room) && room.getIsMine())
		unitName = "harvester";
	else
		unitName = "ldharvester";

	let harvester = creepManager.countRoomUnits(roomName, unitName);
	if (lib.isNull(harvester))
	{
		return 0;
	}
	else
	{
		return harvester.ticksToLive;
	}
};


module.exports = new NeedHarvestSource();