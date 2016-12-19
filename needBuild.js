//-------------------------------------------------------------------------
// needHarvestEnergy
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
var NeedBuild = function ()
{
	Need.call(this);
	this.name = "needBuild";
};

NeedBuild.prototype = Object.create(Need.prototype);
NeedBuild.prototype.constructor = NeedBuild;

NeedBuild.prototype.getUnitDemands = function(roomName, memory)
{
	var result = {};
	result["worker"] = 1;

	return result;
};


module.exports = new NeedBuild();