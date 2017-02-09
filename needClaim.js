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

NeedClaim.prototype.getUnitDemands = function (roomName , needMemory , motivationName)
{
	let room = Game.rooms[roomName];
	needMemory.demands = {};

	if (!room.isMine)
	{
		needMemory.demands["claimer"] = 1;
	}
	else
	{
		if (room.claimSpawn)
		{
			let debug = false;
			let numClaimers = Room.countHomeRoomUnits(roomName , "claimer");

			// filter this to only claims spawning in specified room
			let spawnClaims = _.filter(Memory.claims , 'spawnRoom' , roomName);

			if (_.size(spawnClaims) === 0)
			{
				lib.log(">&>&>&>&>&>&> FAIL: No claims" , debug);
				needMemory.demands["claimer"] = 0;

			}
			else if (numClaimers > _.size(spawnClaims))
			{
				lib.log(">&>&>&>&>&>&> FAIL: Too many claimers" , debug);
				needMemory.demands["claimer"] = 0;
			}
			// if this room is specified as spawn for another room, and the demanded units don't exist, true
			else
			{
				needMemory.demands["claimer"] = 0;

				_.forEach(spawnClaims , function (c)
				{
					if (lib.isNull(Memory.rooms[c.room]))
					{
						Memory.rooms[c.room] = {};
					}
					//console.log(c.room + ": " + _.has(global, "cache.rooms." + c.room + ".units.claimer"));
					let numClaimers = Room.countUnits(c.room , "claimer");
					let claimRoom = Game.rooms[c.room];
					let reservation;

					if (!lib.isNull(claimRoom) && !lib.isNull(claimRoom.controller) && !lib.isNull(claimRoom.controller.reservation))
					{
						reservation = claimRoom.controller.reservation.ticksToEnd;
					}
					else if (!lib.isNull(Memory.rooms[c.room].reservation))
					{
						let timeDiff = Game.time - Memory.rooms[c.room].reservation.time;
						reservation = lib.nullProtect(Memory.rooms[c.room].reservation.reservation , 0) - timeDiff;
						//console.log(timeDiff);
					}
					else
					{
						reservation = 0;
					}

					// don't request a spawn if somebody is already there, or we're not worried about degrade
					if (!numClaimers && reservation < config.claimTicks)
					{
						lib.log(">&>&>&>&>&>&> SUCCESS" , debug);
						needMemory.demands["claimer"]++;
					}

					lib.log("Room: " + c.room + " COUNT: " + numClaimers + " TICKS: " + reservation , debug);
				});
			}
		}
	}

	return needMemory.demands;
};

module.exports = new NeedClaim();