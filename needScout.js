"use strict";

let Need = require('Need.prototype')();

/**
 * NeedScout
 * @constructor
 */
let NeedScout = function ()
{
	Need.call(this);
	this.name = "needScout";
};

NeedScout.prototype = Object.create(Need.prototype);
NeedScout.prototype.constructor = NeedScout;

/**
 * getUnitDemands
 * @param roomName
 * @param memory
 * @param motivationName
 * @returns {{}|*}
 */
NeedScout.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};

	if (!Room.getIsMine(roomName))
	{
		memory.demands["scout"] = 1;
	}
	else
	{
		// demand is driven by if we have seen the room in the time span we want to
		// find scout setting
		let scoutTarget = _.find(Memory.scoutTargets , {sourceRoom: memory.sourceRoom , targetRoom: memory.targetRoom});

		// insure last seen is set

		if (lib.isNull(scoutTarget))
		{
			delete Memory.rooms[roomName].motivations[motivationName].needs[memory.name];
		}
		else
		{
			let numScouts = Room.getUnits(scoutTarget.targetRoom, "scout");
			if (lib.isNull(scoutTarget.lastSeen))
			{
				scoutTarget.lastSeen = 0;
			}
			if (lib.isNull(scoutTarget.travelTime))
			{
				scoutTarget.travelTime = 0;
			}

			//console.log(`numScouts: ${numScouts.length} ${(Game.time - scoutTarget.lastSeen - 1)} ${(scoutTarget.scoutInterval + scoutTarget.travelTime)} `);

			if (!numScouts.length && (Game.time - scoutTarget.lastSeen - 1) > (scoutTarget.scoutInterval + scoutTarget.travelTime))
			{
				memory.demands["scout"] = 1;
			}
			else
			{
				memory.demands["scout"] = 0;
			}
		}
	}

	return memory.demands;
};

module.exports = new NeedScout();
