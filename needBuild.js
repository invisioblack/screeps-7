"use strict";

let Need = require('Need.prototype')();

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

	memory.demands["worker"] = numSites;

	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedBuild();