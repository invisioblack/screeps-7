//-------------------------------------------------------------------------
// jobHarvestSource
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
let JobHarvestMinerals = function ()
{
	Job.call(this);
	this.name = "jobHarvestMinerals";
};

JobHarvestMinerals.prototype = Object.create(Job.prototype);
JobHarvestMinerals.prototype.constructor = JobHarvestMinerals;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobHarvestMinerals.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
	let containers = Room.getStructuresType(creep.room.name , STRUCTURE_CONTAINER);
	let container = target.pos.findInRange(containers, 1)[0];

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
	creep.memory.sourceType = this.JOB_SOURCETYPE_SOURCE;


	let moveResult = creep.travelTo(container);

	if (_.sum(container.store) < container.storeCapacity || (creep.carrying < (creep.carryCapacity - 12)))
	{

		let result = creep.harvest(target);
		//console.log(result);
		if (result === ERR_NOT_ENOUGH_ENERGY)
		{
			creep.sing("Extractor Empty!");
		}
	}
	else
	{
		creep.say("Full!");
		if (creep.pos.getRangeTo(container) != 0)
			creep.travelTo(container);
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobHarvestMinerals();