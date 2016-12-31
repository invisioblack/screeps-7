//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
let Job = require("Job.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------
let JOB_MODE_GETENERGY = 0;
let JOB_MODE_WORK = 1;

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let JobBuild = function ()
{
	Job.call(this);
	this.name = "jobBuild";
};

JobBuild.prototype = Object.create(Job.prototype);
JobBuild.prototype.constructor = JobBuild;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobBuild.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
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
		creep.memory.job.mode = this.JOB_MODE_GETENERGY;
	}

	// manage job
	switch (creep.memory.job.mode)
	{
		case this.JOB_MODE_GETENERGY:
			this.getEnergy(creep);
			break;
		case this.JOB_MODE_WORK:
			this.resetSource(creep);
			if (carry == 0)
			{
				creep.memory.job.mode = this.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			} else {

				let result = creep.build(target);
				// /console.log("build: " + target + " Result: " + result);
				if (result == ERR_NOT_IN_RANGE)
				{
					let moveResult = creep.moveTo(target, {"maxRooms": 1});
					if (moveResult < 0 && moveResult != ERR_TIRED)
						console.log(creep.name + " Can't move while building: " + moveResult);
				} else if (result == ERR_FULL) {
					//console.log("---- RESET");
					creep.deassignMotive();
				}
				else if (result < 0)
					console.log(creep.name + " Can't build: " + target + " result: " + result);
			}
			break;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobBuild();