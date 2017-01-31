//-------------------------------------------------------------------------
// jobHarvest
//-------------------------------------------------------------------------
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
let JobLongDistancePickup = function ()
{
	Job.call(this);
	this.name = "jobLongDistancePickup";
};

JobLongDistancePickup.prototype = Object.create(Job.prototype);
JobLongDistancePickup.prototype.constructor = JobLongDistancePickup;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobLongDistancePickup.prototype.work = function (creep)
{
	let debug = false;
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	// if this is a ldh room
	if (creep.room.isLongDistanceHarvestTarget)
	{
		let carry = creep.carrying;

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

		// manage job
		switch (creep.memory.job.mode)
		{
			case this.JOB_MODE_GETENERGY:

				let container , result;
				lib.log(creep.name + " getting energy " , debug);
				this.findEnergyContainer(creep);

				// If I'm full or there is no energy head home
				if (creep.memory.sourceId === "" || carry === creep.carryCapacity)
				{
					creep.memory.job.mode = this.JOB_MODE_WORK;
					creep.deassignMotive(creep.memory.homeRoom);
				}

				container = Game.getObjectById(creep.memory.sourceId);
				if (!lib.isNull(container))
				{
					result = creep.withdraw(container , RESOURCE_ENERGY);
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.moveTo(container , {"maxRooms": 1});
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					if (container.store[RESOURCE_ENERGY] < 20)
					{
						creep.say("Empty!");
						creep.memory.job.mode = this.JOB_MODE_WORK;
						creep.resetSource();
					}
				}
				else
				{
					creep.resetSource();
				}
				break;
			case this.JOB_MODE_WORK:
				creep.resetSource();
				creep.deassignMotive(creep.memory.homeRoom);
				creep.say("Home!");
		}
	}
	else // not a ldh room
	{
		let target = need.targetRoom;
		let carry = creep.carry[RESOURCE_ENERGY];

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

		if (carry === 0)
		{
			let numHaulers = Room.countUnits(target , "hauler");
			if (numHaulers < 1)
			{
				creep.deassignMotive(target);
				creep.say("LDH!");
			}
			else
			{
				creep.say("NO JOB!");
				creep.deassignMotive(creep.memory.homeRoom);
			}
		}
		else if (creep.room.name != creep.memory.homeRoom)
		{
			creep.deassignMotive(creep.memory.homeRoom);
		}
		else
		{
			// I'm home put the energy in storage
			creep.assignMotive(creep.memory.homeRoom , "motivationHaulToStorage" , "haulStorage." + creep.memory.homeRoom);
		}
	}

};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobLongDistancePickup();