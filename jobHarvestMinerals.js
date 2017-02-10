"use strict";

let Job = require("Job.prototype")();

/**
 * JobHarvestMinerals
 * @constructor
 */
let JobHarvestMinerals = function ()
{
	Job.call(this);
	this.name = "jobHarvestMinerals";
};

JobHarvestMinerals.prototype = Object.create(Job.prototype);
JobHarvestMinerals.prototype.constructor = JobHarvestMinerals;

/**
 * work
 * @param creep
 */
JobHarvestMinerals.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
	let containers = Room.getStructuresType(creep.room.name , STRUCTURE_CONTAINER);
	let container = target.pos.findInRange(containers , 1)[0];

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	if (lib.isNull(container))
	{
		creep.say("No container!");
		return;
	}

	// mark me as using this source
	creep.memory.sourceId = target.id;
	creep.memory.sourceType = C.JOB_SOURCETYPE_SOURCE;

	if (creep.pos.getRangeTo(container) != 0)
	{
		creep.moveTo2(container);
	}
	else
	{
		if (container.carrying < container.storeCapacity)
		{

			let result = creep.harvest(target);
			if (result === ERR_NOT_ENOUGH_ENERGY)
			{
				creep.say("Source Empty!");
			}
		}
		else
		{
			creep.say("Full!");

		}
	}
};

/**
 * Export
 * @type {JobHarvestSource}
 */
module.exports = new JobHarvestMinerals();