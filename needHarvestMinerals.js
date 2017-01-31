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
let NeedHarvestMinerals = function ()
{
	Need.call(this);
	this.name = "needHarvestMinerals";
};

NeedHarvestMinerals.prototype = Object.create(Need.prototype);
NeedHarvestMinerals.prototype.constructor = NeedHarvestMinerals;

NeedHarvestMinerals.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	let unitName = "";
	let room = Game.rooms[roomName];
	let ticksTillHarvesterDeath = this.getTicksTillHarvesterDeath(roomName , memory);

	if (!lib.isNull(room) && room.getIsMine())
	{
		unitName = "harvester";
	}
	else
	{
		unitName = "ldharvester";
	}
	// ---------------------------------------------------
	memory.demands = {};
	memory.demands[unitName] = 1;

	if (ticksTillHarvesterDeath != 0 && ticksTillHarvesterDeath < config.harvesterPrespawnTicks)
	{

		memory.demands[unitName] = 2;
	}
	return memory.demands;
};

NeedHarvestMinerals.prototype.getTicksTillHarvesterDeath = function (roomName , memory)
{
	let unitName = "";
	let room = Game.rooms[roomName];
	if (!lib.isNull(room) && room.getIsMine())
	{
		unitName = "harvester";
	}
	else
	{
		unitName = "ldharvester";
	}

	let harvester = Room.countUnits(roomName , unitName);
	//_.has(global, "cache.rooms." + roomName + ".units." + unitName) ? _.find(global.cache.rooms[roomName].units[unitName], (o) => { return o.memory.motive.need === memory.name; }) : null;
	if (lib.isNull(harvester))
	{
		return 0;
	}
	else
	{
		return harvester.ticksToLive;
	}
};

module.exports = new NeedHarvestMinerals();