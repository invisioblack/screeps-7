//-------------------------------------------------------------------------
// needTransferEnergy
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
let NeedTransferEnergy = function ()
{
	Need.call(this);
	this.name = "needTransferEnergy";
};

NeedTransferEnergy.prototype = Object.create(Need.prototype);
NeedTransferEnergy.prototype.constructor = NeedTransferEnergy;

NeedTransferEnergy.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	memory.demands = {};
	let target = Game.getObjectById(memory.targetId);
	let numHaulers = creepManager.countRoomUnits(roomName, "hauler");
		//_.has(global, "cache.rooms." + roomName + ".units.hauler") ? global.cache.rooms[roomName].units["hauler"].length : 0;

	if (motivationName === "motivationSupplyController")
	{
		memory.demands["worker"] = 999;
	}
	else
	{
		this.getUnitSupplyDemand(roomName , target , "hauler" , memory.demands);
		if (numHaulers > 2)
		{
			memory.demands["worker"] = 0;
		} else
			this.getUnitSupplyDemand(roomName , target , "worker" , memory.demands);
	}

	//console.log(`NeedTransferEnergy.prototype.getUnitDemands: ${motivationName}\t${JSON.stringify(result)}`);

	return memory.demands;
};


module.exports = new NeedTransferEnergy();