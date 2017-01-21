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
let JobHarvestSource = function ()
{
	Job.call(this);
	this.name = "jobHarvestSource";
};

JobHarvestSource.prototype = Object.create(Job.prototype);
JobHarvestSource.prototype.constructor = JobHarvestSource;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobHarvestSource.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
	let container = target.pos.findInRange(FIND_STRUCTURES, 1,{ filter: function (s) { return s.structureType === STRUCTURE_CONTAINER; }})[0];

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


	let moveResult = creep.moveTo(container , {"maxRooms": 1});
	let link = Game.getObjectById(need.linkId);
	if (lib.isNull(creep.room.memory.sourceLinks))
		creep.room.memory.sourceLinks = {};
	if (!lib.isNull(link))
		creep.room.memory.sourceLinks[need.targetId] = link.id;


	if (creep.carryCapacity > 0 && creep.carrying() >= 10 && container.hits < container.hitsMax)
	{
		creep.repair(container);
	}

	if (creep.carryCapacity > 0 && creep.carrying() >= 38 && !lib.isNull(link) && link.energy < link.energyCapacity)
	{
		let tResult = creep.transfer(link, RESOURCE_ENERGY);
	}
	else if (_.sum(container.store) < container.storeCapacity || (creep.carrying() < (creep.carryCapacity - 12)))
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
		if (creep.pos.getRangeTo(container) != 0)
			creep.moveTo(container , {"maxRooms": 1});
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobHarvestSource();