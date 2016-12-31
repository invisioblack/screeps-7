//-------------------------------------------------------------------------
// jobLongDistanceHarvest
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
let JobLongDistanceHarvest = function ()
{
	Job.call(this);
	this.name = "jobLongDistanceHarvest";
};

JobLongDistanceHarvest.prototype = Object.create(Job.prototype);
JobLongDistanceHarvest.prototype.constructor = JobLongDistanceHarvest;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobLongDistanceHarvest.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
	let carry = _.sum(creep.carry);

	creep.say("GLORY!");

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

	//console.log(creep.name + " job/mode: " + creep.memory.job.mode);

	// manage job
	switch (creep.memory.job.mode)
	{
		case this.JOB_MODE_GETENERGY:

			this.getEnergy(creep);
			break;
		case this.JOB_MODE_WORK:
			if (carry == 0)
			{
				creep.memory.job.mode = this.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			} else {
				// once the creep is full of energy, deassign him and send him home
				//console.log("return: " + target);
				this.resetSource(creep);
				creep.deassignMotive();
				creep.memory.motive.room = creep.memory.homeRoom;
			}
			break;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobLongDistanceHarvest();