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
let NeedClaim = function ()
{
	Need.call(this);
	this.name = "needClaim";
};

NeedClaim.prototype = Object.create(Need.prototype);
NeedClaim.prototype.constructor = NeedClaim;

NeedClaim.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	let room = Game.rooms[roomName];
	memory.demands = {};

	if (!room.isMine)
	{
		memory.demands["claimer"] = 1;
	}
	else
	{
		let spawnClaims = _.filter(Memory.claims , function (c)
		{
			return c.spawnRoom === roomName;
		});
		memory.demands["claimer"] = spawnClaims.length;
	}

	return memory.demands;
};

module.exports = new NeedClaim();