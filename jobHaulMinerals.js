"use strict";
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
let JobHaulMinerals = function ()
{
	Job.call(this);
	this.name = "jobHaulMinerals";
};

JobHaulMinerals.prototype = Object.create(Job.prototype);
JobHaulMinerals.prototype.constructor = JobHaulMinerals;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobHaulMinerals.prototype.work = function (creep)
{
	let debug = false;
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId); // this is the storage
	let mineralContainer = Game.getObjectById(creep.room.memory.mineralContainerId);
	let carry = creep.carrying();

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

	lib.log(creep.name + " job/mode: " + creep.memory.job.mode , debug);

	if (lib.isNull(mineralContainer))
	{
		creep.say("No container");
		return;
	}

	// manage job
	switch (creep.memory.job.mode)
	{
		case this.JOB_MODE_GETENERGY:
			lib.log(creep.name + " getting minerals " , debug);
			let result;
			_.forEach(mineralContainer.store , (v , k) =>
			{
				result = creep.withdraw(mineralContainer , k);
				lib.log(creep.name + " withdraw result: " + result , false);
			});

			if (result === ERR_NOT_IN_RANGE)
			{
				let moveResult = creep.moveTo(mineralContainer , {"maxRooms": 1});
			}
			if (carry === creep.carryCapacity || result == ERR_NOT_ENOUGH_ENERGY)
			{
				creep.say("Full!");
				creep.memory.job.mode = this.JOB_MODE_WORK;
				return;
			}
			//console.log(result);
			break;
		case this.JOB_MODE_WORK:
			if (carry === 0)
			{
				creep.memory.job.mode = this.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			}
			else
			{
				let result;
				_.forEach(creep.carry , (v , k) =>
				{
					result = creep.transfer(target , k);
					lib.log(creep.name + " transfer result: " + result , false);
				});

				if (result === ERR_NOT_IN_RANGE)
				{
					let moveResult = creep.moveTo(target , {"maxRooms": 1});
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

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobHaulMinerals();