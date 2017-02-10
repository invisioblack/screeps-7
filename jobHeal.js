"use strict";

let Job = require("Job.prototype")();

/**
 * JobHeal
 * @constructor
 */
let JobHeal = function ()
{
	Job.call(this);
	this.name = "jobHeal";
};

JobHeal.prototype = Object.create(Job.prototype);
JobHeal.prototype.constructor = JobHeal;

/**
 * work
 * @param creep
 */
JobHeal.prototype.work = function (creep)
{
	//avoid hostiles
	if (creep.avoidHostile(creep , 3))
	{
		return;
	}

	//Find my creeps that are hurt. If they're hurt, heal them.
	let healTarget = creep.pos.findClosestByPath(FIND_MY_CREEPS , {
		filter: function (t)
		{
			return t != creep && t.hits < t.hitsMax
		}
	});

	//if healing target then go in for the heal
	if (healTarget)
	{
		creep.moveTo2(healTarget);
		creep.heal(healTarget);
	}
	else
	{
		let targets = creep.room.find(FIND_HOSTILE_CREEPS);
		//if there are hostile targets stay near the action
		if (targets.length)
		{
			let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS , {ignoreCreeps: true});

			if (target)
			{
				if (target.pos.inRangeTo(creep.pos , 2))
				{
					creep.moveTo2(creep.pos.x + creep.pos.x - target.pos.x , creep.pos.y + creep.pos.y - target.pos.y);
				}
				else if (target.pos.inRangeTo(creep.pos , 3))
				{
					creep.rangedAttack(target);
				}
				else
				{
					creep.moveTo2(target);
				}
			}

		} //go back home if it is boring
		else
		{
			let flag = Game.flags.heal;
			let result = creep.moveTo2(flag);
			if (result === ERR_NOT_IN_RANGE)
			{
				creep.rendezvous(flag , 2);
			}
		}
	}
};

/**
 * Export
 * @type {JobHeal}
 */
module.exports = new JobHeal();