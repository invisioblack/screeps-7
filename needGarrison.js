//-------------------------------------------------------------------------
// needGarrison
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
let NeedGarrison = function ()
{
	Need.call(this);
	this.name = "needGarrison";
};

NeedGarrison.prototype = Object.create(Need.prototype);
NeedGarrison.prototype.constructor = NeedGarrison;

NeedGarrison.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let room = Game.rooms[roomName];
	let unitCount = room.memory.threat.count;
	memory.demands = {};
	memory.demands["guard"] = unitCount * 2;
	memory.demands["rangedGuard"] = unitCount * 2;
	memory.demands["heal"] = unitCount * 2;
	return memory.demands;
};


module.exports = new NeedGarrison();
