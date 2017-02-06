"use strict";

let Need = require('Need.prototype')();

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
	let numRepairSites;

	if (needName === "repairNoWall." + roomName)
	{
		let structuresNoWall = Room.getStructuresType(roomName , STRUCTURE_ALL_NOWALL);
		repairSites = _.filter(structuresNoWall , (s) => s.hits < (s.hitsMax * config.repairFactor));
	}
	else if (needName === "repairWall." + roomName)
	{
		let structuresWall = Room.getStructuresType(roomName , STRUCTURE_ALL_WALL);
		repairSites = _.filter(structuresWall , (s) => s.hits < (wallHP * config.repairFactor));
	}
	numRepairSites = repairSites.length;

	//console.log(`room: ${roomName} n: ${needName} s: ${numRepairSites}`);

	memory.demands = {};
	memory.demands["worker"] = numRepairSites;

	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedRepair();