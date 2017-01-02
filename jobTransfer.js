//-------------------------------------------------------------------------
// jobHarvest
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
let JobTransfer = function ()
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
	let debug = creep.room.name === "W14S77";
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
	let carry = creep.carry[RESOURCE_ENERGY];

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

	lib.log(creep.name + " job/mode: " + creep.memory.job.mode, debug);

	// manage job
	switch (creep.memory.job.mode)
	{
		case this.JOB_MODE_GETENERGY:
			lib.log(creep.name + " getting energy ", debug);
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
				this.resetSource(creep);
				let result = creep.transfer(target, RESOURCE_ENERGY);
				lib.log(creep.name + " transfer result: " + result, debug);
				if (result == ERR_NOT_IN_RANGE)
				{

					let moveResult = creep.moveTo(target, {"maxRooms": 1});
					//if (moveResult < 0 && moveResult != ERR_TIRED)
					//	console.log(creep.name + " Can't move while transferring: " + moveResult);
				} else if (result == ERR_FULL) {
					lib.log("---- RESET", debug);
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