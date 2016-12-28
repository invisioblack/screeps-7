//-------------------------------------------------------------------------
// jobHarvest
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var Job = require("Job.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
var JobTransfer = function ()
{
	Job.call(this);
	this.name = "jobTransfer";
};

JobTransfer.prototype = Object.create(Job.prototype);
JobTransfer.prototype.constructor = JobTransfer;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobTransfer.prototype.work = function (creep)
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

				//console.log("return: " + target);
				this.resetSource(creep);
				var result = creep.transfer(target, RESOURCE_ENERGY);
				//console.log(creep.name + " transfer result: " + result);
				if (result == ERR_NOT_IN_RANGE)
				{

					var moveResult = creep.moveTo(target, {"maxRooms": 1});
					if (moveResult < 0 && moveResult != ERR_TIRED)
						console.log(creep.name + " Can't move while transferring: " + moveResult);
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
module.exports = new JobTransfer();