"use strict";

let Job = require("Job.prototype")();

/**
 * JobTransferEnergy
 * @constructor
 */
let JobTransferEnergy = function ()
{
	Job.call(this);
	this.name = "jobTransferEnergy";
};

JobTransferEnergy.prototype = Object.create(Job.prototype);
JobTransferEnergy.prototype.constructor = JobTransferEnergy;

/**
 * work
 * @param creep
 */
JobTransferEnergy.prototype.work = function (creep)
{
	let debug = false;
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
		creep.memory.job.mode = C.JOB_MODE_GETENERGY;
	}

	lib.log(creep.name + " job/mode: " + creep.memory.job.mode , debug);

	// manage job
	switch (creep.memory.job.mode)
	{
		case C.JOB_MODE_GETENERGY:
			lib.log(creep.name + " getting energy " , debug);
			this.getEnergy(creep);
			break;
		case C.JOB_MODE_WORK:
			creep.resetSource();
			if (carry === 0)
			{
				creep.memory.job.mode = C.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			}
			else if (creep.carry[RESOURCE_ENERGY] === 0 && creep.memory.unit === "hauler")
			{
				creep.assignMotive(creep.memory.homeRoom, "motivationHaul", "haulDropoff" + creep.memory.homeRoom);
			}
			else
			{
				//console.log("return: " + target);
				creep.resetSource();
				let result;
				result = creep.transfer(target , RESOURCE_ENERGY);
				lib.log(creep.name + " transfer result: " + result , debug);
				creep.say("Transfer!");

				if (result === ERR_NOT_IN_RANGE)
				{
					let moveResult = creep.moveTo2(target);
					//if (moveResult < 0 && moveResult != ERR_TIRED)
					//	console.log(creep.name + " Can't move while transferring: " + moveResult);
				}
				else if (result === ERR_FULL)
				{
					lib.log("---- RESET" , debug);
					creep.deassignMotive();
				}
			}
			break;
	}
};

/**
 * Export
 * @type {JobTransferEnergy}
 */
module.exports = new JobTransferEnergy();