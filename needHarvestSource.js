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
	let ticksTillHarvesterDeath = this.getTicksTillHarvesterDeath(roomName, memory);
	memory.demands = {};
	memory.demands["harvester"] = 1;

	if (ticksTillHarvesterDeath != 0 && ticksTillHarvesterDeath < config.harvesterPrespawnTicks)
	{
		memory.demands["harvester"] = 2;
	}
	return memory.demands;
};

NeedHarvestSource.prototype.getTicksTillHarvesterDeath = function (roomName, memory)
{
	let harvester = _.find(global.cache.rooms[roomName].units["harvester"], (o) => { return o.memory.motive.need === memory.name; });
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