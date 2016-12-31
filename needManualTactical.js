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
	let room = Game.rooms[roomName];
	let result = {};
	result["guard"] = 99;
	result["rangedGuard"] = 99;
	result["healer"] = 99;
	return result;
};


module.exports = new NeedManualTactical();
