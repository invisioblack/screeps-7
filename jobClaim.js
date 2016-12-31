//-------------------------------------------------------------------------
// jobHarvestSource
//-------------------------------------------------------------------------

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

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	if (creep.room.controller.my)
	{
		// if we're in a room we own, then assign us to a room to take, if that doesn't work, complain
		if (creep.memory.motive.room === creep.room.name)
		{
			_.forEach(Memory.claims, function (c) {
				let countUnits = strategyManager.countRoomUnits(c.room, "claimer");
				if (!countUnits)
				{
					creep.deassignMotive();
					creep.memory.motive.room = c.room;
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
			creep.say("MINE!");
			if (claim.type === "claim")
			{
				if(creep.room.controller) {
					if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller);
					}
				}
			} else if (claim.type === "reserve")
			{
				if(creep.room.controller) {
					if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller);
					}
				}
			} else {
				creep.say("No Type");
			}

		} else {
			creep.say("ERROR!");
		}
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobClaim();
