//-------------------------------------------------------------------------
// jobSupplyExtenders
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
let JobSupplyExtenders = function ()
{
	Job.call(this);
	this.name = "jobSupplyExtenders";
};

JobSupplyExtenders.prototype = Object.create(Job.prototype);
JobSupplyExtenders.prototype.constructor = JobSupplyExtenders;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobSupplyExtenders.prototype.work = function (creep)
{
	let debug = false;
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let carry = creep.carry[RESOURCE_ENERGY];

	creep.sing("Supplying extenders!");

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

	// manage job
	switch (creep.memory.job.mode)
	{
		case this.JOB_MODE_GETENERGY:
			lib.log(creep.name + " getting energy " , debug);
			this.getEnergy(creep);
			break;
		case this.JOB_MODE_WORK:
			this.resetSource(creep);
			if (carry === 0)
			{
				// reset our need assignment when we run out of energy
				creep.memory.job.mode = this.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			}
			else
			{
				this.resetSource(creep);
				let extensions = Room.getStructuresType(creep.room.name , STRUCTURE_EXTENSION);
				let target = creep.pos.findClosestByRange(extensions , {
					ignoreCreeps: true ,
					filter: function (e)
					{
						return e.energy < e.energyCapacity;
					}
				});

				lib.log(creep.name + " target: " + JSON.stringify(target) , debug);

				if (!lib.isNull(target))
				{

					let result = creep.transfer(target , RESOURCE_ENERGY);
					lib.log(creep.name + " transfer result: " + result , debug);
					if (result === ERR_NOT_IN_RANGE)
					{

						let moveResult = creep.moveTo(target , {"maxRooms": 1});
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while transferring: " + moveResult);
					}// else
					//	creep.deassignMotive();
				}
				else
				{
					creep.deassignMotive();
				}
			}
			break;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobSupplyExtenders();