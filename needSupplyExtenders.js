//-------------------------------------------------------------------------
// needSupplyExtenders
//-------------------------------------------------------------------------

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
	let result = {};
	let room = Game.rooms[roomName];
	let energy, energyCapacity, neededEnergy;
	let worker = lib.nullProtect(strategyManager.getRoomUnits(roomName, "worker")[0], {});
	let workerCapacity = lib.nullProtect(worker.carryCapacity, 50);
	let extenderEnergy = room.getExtenderEnergy();
	let hauler = lib.nullProtect(strategyManager.getRoomUnits(roomName, "hauler")[0], {});
	let numWorkers = strategyManager.countRoomUnits(roomName, "worker");
	let numHaulers = strategyManager.countRoomUnits(roomName, "hauler");
	//console.log(JSON.stringify(memory));

	energy = extenderEnergy.energy;
	energyCapacity = extenderEnergy.energyCapacity;
	neededEnergy = energyCapacity - energy;

	result["worker"] = Math.ceil(neededEnergy / workerCapacity);
	result["hauler"] = 999;


	if (numHaulers > 2)
	{
		result["worker"] = 0;
	}

	//console.log(`NeedTransferEnergy.prototype.getUnitDemands: ${motivationName}\t${JSON.stringify(result)}`);

	//console.log(JSON.stringify(memory));
	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	//console.log("   workers: carry: " + workerCapacity + " demanded workers: " + result["worker"]);

	return result;
};


module.exports = new NeedSupplyExtenders();
