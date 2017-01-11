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

NeedRepair.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	memory.demands = {};
	let target = Game.getObjectById(memory.targetId);
	if (!lib.isNull(target))
		memory.demands["worker"] = Math.ceil((target.hitsMax - target.hits)/1000);
	else
		memory.demands["worker"] = 0;
	//console.log(memory.targetId);
	return memory.demands;
};


module.exports = new NeedRepair();