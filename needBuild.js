//-------------------------------------------------------------------------
// needTransferEnergy
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
	var site = Game.getObjectById(memory.targetId);
	if (!lib.isNull(site))
	{
		var workers = Math.ceil((site.progressTotal - site.progress) / 50);
		result["worker"] = workers;
	}

	//console.log(" Build: " + JSON.stringify(site));
	return result;
};


module.exports = new NeedBuild();