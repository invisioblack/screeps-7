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
let JobScout = function ()
{
	Job.call(this);
	this.name = "jobScout";
};

JobScout.prototype = Object.create(Job.prototype);
JobScout.prototype.constructor = JobScout;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobScout.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];

	creep.sing("Hi!" , true);

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
			let assigned = false;
			let scoutTargets = _.filter(Memory.scoutTargets , {sourceRoom: creep.room.name});
			_.forEach(scoutTargets , function (scoutTarget)
			{
				if (!assigned)
				{
					let countUnits = Room.countUnits(scoutTarget.targetRoom , "scout");

					if (countUnits < 1 && (Game.time - scoutTarget.lastSeen) > (scoutTarget.scoutInterval + scoutTarget.travelTime))
					{
						creep.assignToRoom(scoutTarget.targetRoom);
						assigned = true;
					}
				}
			});

			// yell if I'm still set to the room i own
			if (creep.memory.motive.room === creep.room.name)
			{
				creep.sing("NO SCOUT TARGETS!");
			}
		}
	}
	else
	{
		let scoutTarget = _.find(Memory.scoutTargets , {targetRoom: creep.room.name});
		if (lib.isNull(scoutTarget))
		{
			creep.sing("NO SCOUT TARGETS!");
		} else {
			creep.sing("I am watching you!", true);
			scoutTarget.lastSeen = Game.time;
		}
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobScout();

