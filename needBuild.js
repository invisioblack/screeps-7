//-------------------------------------------------------------------------
// needTransferEnergy
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
let NeedBuild = function ()
{
	Need.call(this);
	this.name = "needBuild";
};

NeedBuild.prototype = Object.create(Need.prototype);
NeedBuild.prototype.constructor = NeedBuild;

NeedBuild.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let result = {};
	let site = Game.getObjectById(memory.targetId);
	if (!lib.isNull(site))
	{
		let workers = Math.ceil((site.progressTotal - site.progress) / 50);
		result["worker"] = workers;
	}

	//console.log(" Build: " + JSON.stringify(site));
	return result;
};


module.exports = new NeedBuild();