//-------------------------------------------------------------------------
// needGarrison
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
var NeedGarrison = function ()
{
	Need.call(this);
	this.name = "needGarrison";
};

NeedGarrison.prototype = Object.create(Need.prototype);
NeedGarrison.prototype.constructor = NeedGarrison;

NeedGarrison.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	var room = Game.rooms[roomName];
	var unitCount = room.memory.threat.count;
	var result = {};
	result["guard"] = unitCount * 2;
	result["rangedGuard"] = unitCount * 2;
	result["healer"] = unitCount * 2;
	return result;
};


module.exports = new NeedGarrison();
