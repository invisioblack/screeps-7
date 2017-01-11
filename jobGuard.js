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
	let targets = creep.room.find(FIND_HOSTILE_CREEPS);
	//console.log(JSON.stringify(targets));

	creep.sing("For the glory to the empire!", true);

	if (targets.length)
	{
		let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { ignoreCreeps: true});
		if (target)
		{
			creep.moveTo(target);
			creep.attack(target);
		}
	}
	else
	{
		creep.rendezvous(creep, 5);
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobGuard();

