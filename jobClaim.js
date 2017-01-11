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

	creep.sing("This is mine!", true);

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	if (creep.room.getIsMine())
	{
		// if we're in a room we own, then assign us to a room to take, if that doesn't work, complain
		if (creep.memory.motive.room === creep.room.name)
		{
			_.forEach(Memory.claims, function (c) {
				let countUnits = strategyManager.countRoomUnits(c.room, "claimer");
				if (!countUnits)
				{
					creep.deassignMotive(c.room);
				}
			});

			// yell if I'm still set to the room i own
			if (creep.memory.motive.room === creep.room.name)
			{
				creep.say("NO CLAIM!");
			}
		}
	} else {
		let claim = _.find(Memory.claims, function (c) {
			return c.room === creep.memory.motive.room;
		});
		if (!lib.isNull(claim))
		{
			if (claim.type === "claim")
			{
				if(creep.room.controller) {
					if(creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller);
					}
				}
			} else if (claim.type === "reserve")
			{
				if(creep.room.controller) {
					if(creep.reserveController(creep.room.controller) === ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller);
					}
				}
			} else {
				creep.say("No Type");
			}

		} else {
			creep.say("GetShwifty");
		}
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobClaim();
