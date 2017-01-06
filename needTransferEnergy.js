//-------------------------------------------------------------------------
// needTransferEnergy
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
let NeedTransferEnergy = function ()
{
	Need.call(this);
	this.name = "needTransferEnergy";
};

NeedTransferEnergy.prototype = Object.create(Need.prototype);
NeedTransferEnergy.prototype.constructor = NeedTransferEnergy;

NeedTransferEnergy.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let result = {};
	let room = Game.rooms[roomName];
	let target = Game.getObjectById(memory.targetId);
	let energy, energyCapacity, neededEnergy;
	let worker = lib.nullProtect(room.getUnits("worker")[0], {});
	let workerCapacity = lib.nullProtect(worker.carryCapacity, 50);
	//console.log(JSON.stringify(memory));

	if (lib.isNull(target))
	{
		energyCapacity = 0;
		energy = 0;
	}
	else if (!lib.isNull(target.energy))
	{
		energyCapacity = target.energyCapacity;
		energy = target.energy;
	} else {
		energyCapacity = target.progressTotal;
		energy = target.progress;
	}

	neededEnergy = energyCapacity - energy;
	result["worker"] = Math.ceil(neededEnergy / workerCapacity) * 10;

	//console.log(JSON.stringify(memory));
	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	//console.log("   workers: carry: " + workerCapacity + " demanded workers: " + result["worker"]);

	return result;
};


module.exports = new NeedTransferEnergy();