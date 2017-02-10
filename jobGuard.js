"use strict";

let Job = require("Job.prototype")();

/**
 * jobGuard
 * @constructor
 */
let JobGuard = function ()
{
	Job.call(this);
	this.name = "jobGuard";
};

JobGuard.prototype = Object.create(Job.prototype);
JobGuard.prototype.constructor = JobGuard;

/**
 * work
 * @param creep
 */
JobGuard.prototype.work = function (creep)
{
	let threats = _.map(creep.room.memory.threat.threats, t => Game.getObjectById(t.id));
	let target = creep.pos.findClosestByPath(threats, { ignoreCreeps: true});
	if (target && diplomacyManager.status(target.owner.username) === C.RELATION_HOSTILE)
	{
		creep.moveTo2(target);
		creep.attack(target);
	}
};

/**
 * Export
 * @type {JobGuard}
 */
module.exports = new JobGuard();

