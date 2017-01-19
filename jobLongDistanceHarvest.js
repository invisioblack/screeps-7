//-------------------------------------------------------------------------
// jobLongDistanceHarvest
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
let JobLongDistanceHarvest = function ()
{
	Job.call(this);
	this.name = "jobLongDistanceHarvest";
};

JobLongDistanceHarvest.prototype = Object.create(Job.prototype);
JobLongDistanceHarvest.prototype.constructor = JobLongDistanceHarvest;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobLongDistanceHarvest.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let target = Game.getObjectById(need.targetId);
	let carry = _.sum(creep.carry);



	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	// TODO: This needs to figure out which ldh room needs a harvester and assign him there


};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobLongDistanceHarvest();