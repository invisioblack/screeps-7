//-------------------------------------------------------------------------
// needHarvestSource
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
var NeedHarvestSource = function ()
{
	Need.call(this);
	this.name = "needHarvestSource";
};

NeedHarvestSource.prototype = Object.create(Need.prototype);
NeedHarvestSource.prototype.constructor = NeedHarvestSource;

NeedHarvestSource.prototype.getUnitDemands = function(roomName, memory)
{
	var result = {};
	result["harvester"] = 1;

	return result;
};


module.exports = new NeedHarvestSource();