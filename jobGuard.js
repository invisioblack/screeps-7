//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
"use strict";

let Job = require("Job.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let JobGuard = function ()
{
	Job.call(this);
	this.name = "jobGuard";
};

JobGuard.prototype = Object.create(Job.prototype);
JobGuard.prototype.constructor = JobGuard;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobGuard.prototype.work = function (creep)
{
	let threats = _.map(creep.room.memory.threat.threats, t => Game.getObjectById(t.id));
	let target = creep.pos.findClosestByPath(threats, { ignoreCreeps: true});
	if (target && diplomacyManager.status(target.owner.username) === C.RELATION_HOSTILE)
	{
		creep.travelTo(target);
		creep.attack(target);
	}

	if (creep.room.memory.threat.level < C.THREAT_NPC)
	{
		let assigned = false;
		_.forEach(creep.room.memory.longDistanceHarvestTargets, (r) => {
			if (!assigned) {
				let numGuards = Room.countUnits(r, "guard");
				let threatLevel = Memory.rooms[r].threat.level;

				if (numGuards < 1 && threatLevel >= C.THREAT_NPC) {
					assigned = true;
					creep.deassignMotive(r);
				}
			}
		});
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobGuard();

