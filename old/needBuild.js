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

NeedBuild.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	let numSites = Room.getConstructionIds(roomName).length;
	memory.demands = {};

	if (numSites > 5)
	{
		memory.demands["worker"] = 2;
	}
	else if (numSites > 0)
	{
		memory.demands["worker"] = 1;
	}
	else
	{
		memory.demands["worker"] = 0;
	}

	return memory.demands;
};

module.exports = new NeedBuild();