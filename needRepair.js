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

NeedRepair.prototype.getUnitDemands = function(roomName, memory)
{
	var result = {};
	result["worker"] = 1;

	return result;
};


module.exports = new NeedRepair();