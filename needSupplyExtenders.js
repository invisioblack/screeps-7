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
	let workerCapacity = lib.nullProtect(worker.carryCapacity, 50);
	let extenderEnergy = room.getExtenderEnergy();
	let hauler = lib.nullProtect(creepManager.getRoomUnits(roomName, "hauler")[0], {});
	let numHaulers = creepManager.countRoomUnits(roomName, "hauler");
		//_.has(global, "cache.rooms." + roomName + ".units.hauler") ? global.cache.rooms[roomName].units["hauler"].length : 0;
	//console.log(JSON.stringify(memory));

	energy = extenderEnergy.energy;
	energyCapacity = extenderEnergy.energyCapacity;
	neededEnergy = energyCapacity - energy;

	memory.demands["worker"] = Math.ceil(neededEnergy / workerCapacity);
	memory.demands["hauler"] = 999;


	if (numHaulers > 1)
	{
		memory.demands["worker"] = 0;
	}

	//console.log(`NeedTransferEnergy.prototype.getUnitDemands: ${motivationName}\t${JSON.stringify(result)}`);

	//console.log(JSON.stringify(memory));
	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	//console.log("   workers: carry: " + workerCapacity + " demanded workers: " + result["worker"]);

	return memory.demands;
};


module.exports = new NeedSupplyExtenders();
