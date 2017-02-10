"use strict";

let Job = require("Job.prototype")();

/**
 * JobTransferEnergy
 * @constructor
 */
let JobDropoff = function ()
{
	Job.call(this);
	this.name = "jobDropoff";
};

JobDropoff.prototype = Object.create(Job.prototype);
JobDropoff.prototype.constructor = JobDropoff;

/**
 * work
 * @param creep
 */
JobDropoff.prototype.work = function (creep)
{
	let debug = false;
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	// validate target
	if (lib.isNull(target))
	{
		console.log("Null target");
		creep.sing("Null target!");
		return;
	}

	// manage job
	creep.resetSource();
	if (creep.carrying === 0)
	{
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
			if (creep.room.name !== target.room.name)
			{
				creep.deassignMotive(target.room.name);
			}
			creep.say("DropOff!");
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

};

/**
 * Export
 * @type {JobDropoff}
 */
module.exports = new JobDropoff();