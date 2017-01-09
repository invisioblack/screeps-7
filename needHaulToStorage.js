//-------------------------------------------------------------------------
// needHaulToStorage
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
let NeedHaulToStorage = function ()
{
	Need.call(this);
	this.name = "needHaulToStorage";
};

NeedHaulToStorage.prototype = Object.create(Need.prototype);
NeedHaulToStorage.prototype.constructor = NeedHaulToStorage;

NeedHaulToStorage.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let result = {};

	this.getUnitHaulToStorageDemand(roomName, "hauler", result);


	//console.log(JSON.stringify(memory));
	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	//console.log("   workers: carry: " + workerCapacity + " demanded workers: " + result["worker"]);

	//console.log(`NeedTransferEnergy.prototype.getUnitDemands: ${motivationName}\t${JSON.stringify(result)}`);

	return result;
};


module.exports = new NeedHaulToStorage();