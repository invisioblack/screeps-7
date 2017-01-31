//-------------------------------------------------------------------------
// needClaim
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
let NeedScout = function ()
{
	Need.call(this);
	this.name = "needScout";
};

NeedScout.prototype = Object.create(Need.prototype);
NeedScout.prototype.constructor = NeedScout;

NeedScout.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};



	if (!Room.isMine(roomName))
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
			if (lib.isNull(scoutTarget.lastSeen))
			{
				scoutTarget.lastSeen = 0;
			}
			if (lib.isNull(scoutTarget.travelTime))
			{
				scoutTarget.travelTime = 0;
			}

			if ((Game.time - scoutTarget.lastSeen) > (scoutTarget.scoutInterval + scoutTarget.travelTime))
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
