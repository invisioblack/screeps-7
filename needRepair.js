//-------------------------------------------------------------------------
// needRepair
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
var NeedRepair = function ()
{
	Need.call(this);
	this.name = "needRepair";
};

NeedRepair.prototype = Object.create(Need.prototype);
NeedRepair.prototype.constructor = NeedRepair;

NeedRepair.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	var result = {};
	var target = Game.getObjectById(memory.targetId);
	if (!lib.isNull(target))
		result["worker"] = Math.ceil((target.hitsMax - target.hits)/1000);
	else
		result["worker"] = 0;
	//console.log(memory.targetId);
	return result;
};


module.exports = new NeedRepair();