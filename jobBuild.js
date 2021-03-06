"use strict";

let Job = require("Job.prototype")();

let JobBuild = function ()
{
	Job.call(this);
	this.name = "jobBuild";
};

JobBuild.prototype = Object.create(Job.prototype);
JobBuild.prototype.constructor = JobBuild;

JobBuild.prototype.work = function (creep)
{
	let constructionSites = Room.getConstruction(creep.room.name);
	let target = _.min(constructionSites , (c) => c.progressTotal - c.progress);
	let carry = _.sum(creep.carry);

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	// set up mode memory
	if (lib.isNull(creep.memory.job))
	{
		creep.memory.job = {};
	}
	if (lib.isNull(creep.memory.job.mode))
	{
		creep.memory.job.mode = C.JOB_MODE_GETENERGY;
	}

	// manage job
	switch (creep.memory.job.mode)
	{
		case C.JOB_MODE_GETENERGY:
			this.getEnergy(creep);
			break;
		case C.JOB_MODE_WORK:
			creep.resetSource();
			creep.say("Building!");
			if (carry === 0)
			{
				creep.memory.job.mode = C.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			}
			else
			{

				let result = creep.build(target);
				//console.log("build: " + target + " Result: " + result);
				if (result === ERR_NOT_IN_RANGE)
				{
					let moveResult = creep.moveTo2(target);
					//if (moveResult < 0 && moveResult != ERR_TIRED)
					//	console.log(creep.name + " Can't move while building: " + moveResult);
				}
				else if (result === ERR_FULL)
				{
					//console.log("---- RESET");
					creep.deassignMotive();
				}
				else if (result < 0)
				{
					creep.deassignMotive();
					console.log(creep.name + " Can't build: " + target + " result: " + result);
				}
			}
			break;
	}
};

module.exports = new JobBuild();