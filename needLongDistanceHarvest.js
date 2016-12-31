//-------------------------------------------------------------------------
// needLongDistanceHarvest
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
let NeedLongDistanceHarvest = function ()
{
	Need.call(this);
	this.name = "needLongDistanceHarvest";
};

NeedLongDistanceHarvest.prototype = Object.create(Need.prototype);
NeedLongDistanceHarvest.prototype.constructor = NeedLongDistanceHarvest;

NeedLongDistanceHarvest.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let result = {};
	let source = Game.getObjectById(memory.targetId);
	result["worker"] = source.getMaxHarvesters();
	//console.log("-----------LDH: " + result["worker"]);
	return result;
};


module.exports = new NeedLongDistanceHarvest();