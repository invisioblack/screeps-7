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
 * @param memory
 * @param motivationName
 * @returns {{}|*}
 */
NeedHarvestSource.prototype.getUnitDemands = function (roomName , memory , motivationName)
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
	memory.demands = {};
	memory.demands[unitName] = 1;

	return memory.demands;
};

module.exports = new NeedHarvestSource();
