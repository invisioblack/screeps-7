"use strict";

let Job = require("Job.prototype")();

/**
 * JobTransferEnergy
 * @constructor
 */
let JobHaul = function ()
{
	Job.call(this);
	this.name = "jobHaul";
};

JobHaul.prototype = Object.create(Job.prototype);
JobHaul.prototype.constructor = JobHaul;

/**
 * work
 * @param creep
 */
JobHaul.prototype.work = function (creep)
{
	let debug = true;
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
	let source = Game.getObjectById(need.sourceId);

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	if (creep.carrying === creep.carryCapacity)
	{
		creep.say("Full!");
		creep.resetSource();
		creep.memory.job.mode = C.JOB_MODE_WORK;
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

	// validate source and target
	if (lib.isNull(source))
	{
		console.log("Null source");
		creep.sing("Null source!");
		return;
	}
	if (lib.isNull(target))
	{
		console.log("Null target");
		creep.sing("Null target!");
		return;
	}
	console.log(source);
	// manage job
	switch (creep.memory.job.mode)
	{
		case C.JOB_MODE_GETENERGY:
			lib.log(creep.name + " getting cargo " , debug);
			let result;
			if (source.carrying)
			{
				_.forEach(source.store , (v , k) =>
				{
					if (v > 0)
					{
						result = creep.withdraw(source , k);
						lib.log(creep.name + " withdraw result: " + result , debug);
						if (result === ERR_NOT_IN_RANGE)
						{
							result = creep.travelTo(source);
							if (result < 0 && result != ERR_TIRED)
								console.log(creep.name + " Can't move while getting from container: " + result);
						}

						creep.say("Take!");
						return false;
					}
				});
			}
			else
			{
				creep.say("Empty!");
				creep.memory.job.mode = C.JOB_MODE_WORK;
				creep.resetSource();
			}
			break;
		case C.JOB_MODE_WORK:
			creep.resetSource();
			if (creep.carrying === 0)
			{
				creep.memory.job.mode = C.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			}
			else
			{
				//console.log("return: " + target);
				creep.resetSource();
				let result;
				_.forEach(creep.carry , (v , k) =>
				{
					if (v > 0)
					{
						result = creep.transfer(target , k);
						lib.log(creep.name + " transfer result: " + result , false);
						creep.say("Give!");
					}
				});

				if (result === ERR_NOT_IN_RANGE)
				{
					creep.say("Haul!");
					let moveResult = creep.travelTo(target);
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
 * @type {JobHaul}
 */
module.exports = new JobHaul();