//-------------------------------------------------------------------------
// needLongDistanceHarvest
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
var NeedLongDistanceHarvest = function ()
{
	Need.call(this);
	this.name = "needLongDistanceHarvest";
};

NeedLongDistanceHarvest.prototype = Object.create(Need.prototype);
NeedLongDistanceHarvest.prototype.constructor = NeedLongDistanceHarvest;

NeedLongDistanceHarvest.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	var result = {};
	var source = Game.getObjectById(memory.targetId);
	result["worker"] = source.getMaxHarvesters();
	//console.log("-----------LDH: " + result["worker"]);
	return result;
};


module.exports = new NeedLongDistanceHarvest();