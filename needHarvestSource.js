"use strict";

let Need = require('Need.prototype')();

/**
 * NeedHarvestSource
 * @constructor
 */
let NeedHarvestSource = function ()
{
	Need.call(this);
	this.name = "needHarvestSource";
};

NeedHarvestSource.prototype = Object.create(Need.prototype);
NeedHarvestSource.prototype.constructor = NeedHarvestSource;

/**
 * getUnitDemands
 * @param roomName
 * @param needMemory
 * @param motivationName
 * @returns {{}|*}
 */
NeedHarvestSource.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	let unitName = "";
	let room = Game.rooms[roomName];

	if (!lib.isNull(room) && room.isMine)
	{
		unitName = "harvester";
	}
	else
	{
		unitName = "rharvester";
	}
	// ---------------------------------------------------
	needMemory.demands = {};
	needMemory.demands[unitName] = 1;

	return needMemory.demands;
};

module.exports = new NeedHarvestSource();
