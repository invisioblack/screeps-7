//-------------------------------------------------------------------------
// NeedManualTactical
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
let NeedManualTactical = function ()
{
	Need.call(this);
	this.name = "needManualTactical";
};

NeedManualTactical.prototype = Object.create(Need.prototype);
NeedManualTactical.prototype.constructor = NeedManualTactical;

NeedManualTactical.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	memory.demands = {};
	memory.demands["guard"] = 99;
	memory.demands["rangedGuard"] = 99;
	memory.demands["healer"] = 99;

	return memory.demands;
};


module.exports = new NeedManualTactical();
