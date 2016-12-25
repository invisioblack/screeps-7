//-------------------------------------------------------------------------
// needRepair
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');

// script prototypes
var Need = require('prototype.need')();

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

	result["worker"] = Math.ceil((target.hitsMax - target.hits)/1000);
	//console.log(target + " " + result["worker"]);
	return result;
};


module.exports = new NeedRepair();