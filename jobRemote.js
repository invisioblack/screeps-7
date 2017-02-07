"use strict";

let Job = require("Job.prototype")();

/**
 * jobRemote
 * @constructor
 */
let jobRemote = function ()
{
	Job.call(this);
	this.name = "jobRemote";
};

jobRemote.prototype = Object.create(Job.prototype);
jobRemote.prototype.constructor = jobRemote;

/**
 * work
 * @param creep
 */
jobRemote.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	if (creep.room.isMine)
	{
		creep.deassignMotive(need.targetRoom);
	}
	else
	{
		creep.sing("jobRemote in my room.");
	}
};

/**
 * Export
 * @type {jobRHarvest}
 */
module.exports = new jobRemote();
