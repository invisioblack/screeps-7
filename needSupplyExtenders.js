//-------------------------------------------------------------------------
// needSupplyExtenders
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
let NeedSupplyExtenders = function ()
{
	Need.call(this);
	this.name = "needSupplyExtenders";
};

NeedSupplyExtenders.prototype = Object.create(Need.prototype);
NeedSupplyExtenders.prototype.constructor = NeedSupplyExtenders;

NeedSupplyExtenders.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let numHaulers = creepManager.countRoomUnits(roomName, "hauler");
	memory.demands = {};

	memory.demands["worker"] = 2;
	memory.demands["hauler"] = 1;

	if (numHaulers > 1)
	{
		memory.demands["worker"] = 0;
	}

	return memory.demands;
};


module.exports = new NeedSupplyExtenders();
