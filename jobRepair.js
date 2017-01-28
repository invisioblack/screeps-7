//-------------------------------------------------------------------------
// jobRepair
//-------------------------------------------------------------------------
"use strict";

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
let JobRepair = function ()
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
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let needName = need.name;
	let repairSites = [];
	let roomName = creep.room.name;
	let carry = _.sum(creep.carry);
	let target;

	if (needName === "repairNoWall." + roomName)
	{
		let structuresNoWall = roomManager.getStructuresType(roomName , STRUCTURE_ALL_NOWALL);
		repairSites = _.filter(structuresNoWall , (s) => s.hits < (s.hitsMax * config.repairFactor));
	}
	else if (needName === "repairWall." + roomName)
	{
		let structuresWall = roomManager.getStructuresType(roomName , STRUCTURE_ALL_WALL);
		repairSites = _.filter(structuresWall , (s) => s.hits < (wallHP * config.repairFactor));
	}

	target = _.min(repairSites , (c) => c.progressTotal - c.progress);

	creep.sing("Fixing stuff!");

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
			if (carry === 0)
			{
				creep.memory.job.mode = this.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			}
			else
			{

				let result = creep.repair(target);
				//console.log("return: " + target);
				//console.log("creep: " + creep.name);
				if (result === ERR_NOT_IN_RANGE)
				{
					let moveResult = creep.moveTo(target , {"maxRooms": 1});
					//if (moveResult < 0 && moveResult != ERR_TIRED)
					//	console.log(creep.name + " Can't move while repairing: " + moveResult);
				}
				else if (result === ERR_FULL)
				{
					//console.log("---- RESET");
					creep.deassignMotive();
				}
				if (target.hits === target.hitsMax)
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
module.exports = new JobRepair();
