//-------------------------------------------------------------------------
// jobHarvestSource
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
let Job = require("Job.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let JobClaim = function ()
{
	Job.call(this);
	this.name = "jobClaim";
};

JobClaim.prototype = Object.create(Job.prototype);
JobClaim.prototype.constructor = JobClaim;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobClaim.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];

	creep.sing("This is mine!" , true);

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}
	if (creep.room.isMine)
	{
		// if we're in a room we own, then assign us to a room to take, if that doesn't work, complain
		if (creep.memory.motive.room === creep.room.name)
		{
			// filter this to only claims spawning in specified room
			let spawnClaims = _.filter(Memory.claims , function (c)
			{
				return c.spawnRoom === creep.memory.motive.room;
			});

			let assigned = false;
			_.forEach(spawnClaims , function (c)
			{
				let countUnits = Room.countUnits(c.room , "claimer");
				//_.has(global, "cache.rooms." + c.room + ".units.claimer") ? global.cache.rooms[c.room].units["claimer"].length : 0;
				if (!countUnits && !assigned)
				{
					let reservation = 0;
					if (lib.isNull(Memory.rooms[c.room]))
					{
						Memory.rooms[c.room] = {};
					}
					if (!lib.isNull(Memory.rooms[c.room].reservation))
					{
						let timeDiff = Game.time - Memory.rooms[c.room].reservation.time;
						reservation = lib.nullProtect(Memory.rooms[c.room].reservation.reservation , 0) - timeDiff;
					}

					if (reservation < config.claimTicks)
					{
						creep.deassignMotive(c.room);
						assigned = true;
					}
				}
			});

			// yell if I'm still set to the room i own
			if (creep.memory.motive.room === creep.room.name)
			{
				creep.sing("NO CLAIM!");
			}
		}
	}
	else
	{
		let claim = _.find(Memory.claims , function (c)
		{
			return c.room === creep.memory.motive.room;
		});

		if (!lib.isNull(claim))
		{

			if (claim.type === "claim")
			{
				if (creep.room.controller)
				{
					if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE)
					{
						creep.moveTo2(creep.room.controller);
					}
				}
			}
			else if (claim.type === "reserve")
			{
				if (creep.room.controller)
				{
					if (creep.reserveController(creep.room.controller) === ERR_NOT_IN_RANGE)
					{
						creep.moveTo2(creep.room.controller);
					}
				}
			}
			else
			{
				creep.sing("No Type!");
			}

		}
		else
		{
			creep.sing("Get Shwifty");
		}
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobClaim();
