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
	let target = Game.getObjectById(memory.targetId);
	let numHaulers = strategyManager.countRoomUnits(roomName, "hauler");

	if (motivationName === "motivationSupplyController")
	{
		result["worker"] = 999;
	}
	else
	{
		this.getUnitSupplyDemand(roomName , target , "hauler" , result);
		if (numHaulers > 2)
		{
			result["worker"] = 0;
		} else
			this.getUnitSupplyDemand(roomName , target , "worker" , result);
	}

	//console.log(`NeedTransferEnergy.prototype.getUnitDemands: ${motivationName}\t${JSON.stringify(result)}`);

	return result;
};


module.exports = new NeedTransferEnergy();