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
	let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { ignoreCreeps: true});

	if (target && diplomacyManager.status(target.owner.username) === C.RELATION_HOSTILE)
	{
		creep.moveTo(target);
		creep.attack(target);
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobGuard();

