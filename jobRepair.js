//-------------------------------------------------------------------------
// jobRepair
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require("lib");
var Job = require("prototype.job")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------
var JOB_MODE_GETENERGY = 0;
var JOB_MODE_WORK = 1;

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
var JobRepair = function ()
{
	Job.call(this);
	this.name = "jobRepair";
};

JobRepair.prototype = Object.create(Job.prototype);
JobRepair.prototype.constructor = JobRepair;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------

JobRepair.prototype.work = function (creep)
{
	var need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	var target = Game.getObjectById(need.targetId);
	var carry = _.sum(creep.carry);

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
				//console.log("return: " + target);
				var result = creep.repair(target);
				if (result == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(target);
				} else if (result == ERR_FULL) {
					//console.log("---- RESET");
					creep.deassignMotive();
				}
			}
			break;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobRepair();
