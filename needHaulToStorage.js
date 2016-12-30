//-------------------------------------------------------------------------
// needHaulToStorage
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
var Need = require('Need.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
var NeedHaulToStorage = function ()
{
	Need.call(this);
	this.name = "needHaulToStorage";
};

NeedHaulToStorage.prototype = Object.create(Need.prototype);
NeedHaulToStorage.prototype.constructor = NeedHaulToStorage;

NeedHaulToStorage.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	var result = {};
	result["hauler"] = 2;

	//console.log(JSON.stringify(memory));
	//console.log("getUnitDemands: " + energy + "/" + energyCapacity + "/" + neededEnergy);
	//console.log("   workers: carry: " + workerCapacity + " demanded workers: " + result["worker"]);

	return result;
};


module.exports = new NeedHaulToStorage();