//-------------------------------------------------------------------------
// needTransferEnergy
//-------------------------------------------------------------------------
"use strict";
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
	memory.demands = {};
	let site = Game.getObjectById(memory.targetId);
	if (!lib.isNull(site))
	{
		let workers = Math.ceil((site.progressTotal - site.progress) / 50);
		memory.demands["worker"] = workers;
	}

	//console.log(" Build: " + JSON.stringify(site));
	return memory.demands;
};


module.exports = new NeedBuild();