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
let JobRangedGuard = function ()
{
	Job.call(this);
	this.name = "jobRangedGuard";
};

JobRangedGuard.prototype = Object.create(Job.prototype);
JobRangedGuard.prototype.constructor = JobRangedGuard;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobRangedGuard.prototype.work = function (creep)
{
	let threats = _.map(creep.room.memory.threat.threats, t => Game.getObjectById(t.id));
	let target = creep.pos.findClosestByPath(threats , {ignoreCreeps: true});

	if (target && diplomacyManager.status(target.owner.username) === C.RELATION_HOSTILE)
	{
		if (target.pos.inRangeTo(creep.pos , 2))
		{
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x , creep.pos.y + creep.pos.y - target.pos.y);
		}
		else if (target.pos.inRangeTo(creep.pos , 3))
		{
			creep.rangedAttack(target);
		}
		else
		{
			creep.moveTo(target);
		}
	}
};
//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobRangedGuard();