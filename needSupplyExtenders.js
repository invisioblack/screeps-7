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
	memory.demands = {};
	let room = Game.rooms[roomName];
	let energy, energyCapacity, neededEnergy;
	let worker = lib.nullProtect(creepManager.getRoomUnits(roomName, "worker")[0], {});
	let workerCapacity = lib.nullProtect(worker.carryCapacity, 300);
	let extenderEnergy = room.getExtenderEnergy();
	let hauler = lib.nullProtect(creepManager.getRoomUnits(roomName, "hauler")[0], {});
	let haulerCapacity = lib.nullProtect(hauler.carryCapacity, 1000);
	let numHaulers = creepManager.countRoomUnits(roomName, "hauler");

	energy = extenderEnergy.energy;
	energyCapacity = extenderEnergy.energyCapacity;
	neededEnergy = energyCapacity - energy;

	memory.demands["worker"] = lib.clamp(Math.ceil(neededEnergy / workerCapacity), 0, 3);
	memory.demands["hauler"] = lib.clamp(Math.ceil(neededEnergy / haulerCapacity), 0 , 3);


	if (numHaulers > 1)
	{
		memory.demands["worker"] = 0;
	}

	return memory.demands;
};


module.exports = new NeedSupplyExtenders();
