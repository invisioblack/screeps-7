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
var NeedHarvestEnergy = function ()
{
	Need.call(this);
	this.name = "needHarvestEnergy";
};

NeedHarvestEnergy.prototype = Object.create(Need.prototype);
NeedHarvestEnergy.prototype.constructor = NeedHarvestEnergy;

module.exports = new NeedHarvestEnergy();