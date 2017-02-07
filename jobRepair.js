"use strict";

let Job = require("Job.prototype")();

let JobRepair = function ()
{
	Job.call(this);
	this.name = "jobRepair";
};

JobRepair.prototype = Object.create(Job.prototype);
JobRepair.prototype.constructor = JobRepair;

JobRepair.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let needName = need.name;
	let repairSites = [];
	let roomName = creep.room.name;
	let target;
	let wallHP = config.wallHP[lib.isNull(creep.room.controller) ? 0 : creep.room.controller.level];


	if (!lib.isNull(creep.memory.repairTargetId) && creep.memory.repairTargetId !== "")
	{
		target = Game.getObjectById(creep.memory.repairTargetId);
	}

	if (lib.isNull(target) || target.room.name !== creep.room.name)
	{
		if (needName === "repairNoWall." + roomName)
		{
			let structuresNoWall = Room.getStructuresType(roomName , STRUCTURE_ALL_NOWALL);
			repairSites = _.filter(structuresNoWall , (s) => s.hits < (s.hitsMax * config.repairFactor));
		}
		else if (needName === "repairWall." + roomName)
		{
			let structuresWall = Room.getStructuresType(roomName , STRUCTURE_ALL_WALL);
			repairSites = _.filter(structuresWall , (s) => s.hits < (wallHP * config.repairFactor));
		}

		target = _.min(repairSites , 'hits');
		creep.memory.repairTargetId = target.id;
		//console.log(`c: ${creep.name} New Target: ${target}`);
	}

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

	// manage job
	switch (creep.memory.job.mode)
	{
		case C.JOB_MODE_GETENERGY:
			this.getEnergy(creep);
			break;
		case C.JOB_MODE_WORK:
			creep.resetSource();
			creep.sing("Repairing!");

			if (creep.carrying === 0)
			{
				creep.memory.job.mode = C.JOB_MODE_GETENERGY;
				creep.deassignMotive();
			}
			else
			{

				let result = creep.repair(target);
				//console.log("return: " + target);
				//console.log("creep: " + creep.name);
				if (result === ERR_NOT_IN_RANGE)
				{
					let moveResult = creep.moveTo2(target);
					//if (moveResult < 0 && moveResult != ERR_TIRED)
					//	console.log(creep.name + " Can't move while repairing: " + moveResult);
				}
				else if (result === ERR_FULL)
				{
					//console.log("---- RESET");
					creep.deassignMotive();
					creep.memory.repairTargetId = "";
				}
				if (target.hits === target.hitsMax)
				{
					creep.deassignMotive();
					creep.memory.repairTargetId = "";
				}
			}
			break;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobRepair();
