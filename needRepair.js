//-------------------------------------------------------------------------
// needRepair
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
let NeedRepair = function ()
{
	Need.call(this);
	this.name = "needRepair";
};

NeedRepair.prototype = Object.create(Need.prototype);
NeedRepair.prototype.constructor = NeedRepair;

NeedRepair.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	let room = Game.rooms[roomName];
	let needName = memory.name;
	let wallHP = config.wallHP[lib.isNull(room.controller) ? 0 : room.controller.level];
	let repairSites = [];
	let numRepairSites = 0;

	if (needName === "repairNoWall." + roomName)
	{
		let structuresNoWall = roomManager.getStructuresType(roomName , STRUCTURE_ALL_NOWALL);
		repairSites = _.filter(structuresNoWall , (s) => s.hits < (s.hitsMax * config.repairFactor));
	}
	else if (needName === "repairWall." + roomName)
	{
		let structuresWall = roomManager.getStructuresType(roomName , STRUCTURE_ALL_WALL);
		repairSites = _.filter(structuresWall , (s) => s.hits < (wallHP * config.repairFactor));
	}
	numRepairSites = repairSites.length;

	memory.demands = {};

	if (numRepairSites > 0)
	{
		memory.demands["worker"] = 1;
	}
	else
	{
		memory.demands["worker"] = 0;
	}

	return memory.demands;
};

module.exports = new NeedRepair();