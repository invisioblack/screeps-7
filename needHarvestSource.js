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
	var creep = _.filter(Game.creeps, function (c){
			return c.room.name == roomName
				&& c.memory.motive.need == memory.name;
	});
	//console.log(" harvest: " + creep);

	if (!lib.isNull(creep[0]) && creep[0].ticksToLive < 200)
		result["harvester"] = 2;
	else
		result["harvester"] = 1;

	return result;
};


module.exports = new NeedHarvestSource();