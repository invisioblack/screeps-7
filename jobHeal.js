//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
"use strict";
let Job = require("Job.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let JobHeal = function ()
{
	Job.call(this);
	this.name = "jobHeal";
};

JobHeal.prototype = Object.create(Job.prototype);
JobHeal.prototype.constructor = JobHeal;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobHeal.prototype.work = function (creep)
{
	//avoid hostiles
	if (creep.avoidHostile(creep, 3))
	{
		return;
	}

	//Find my creeps that are hurt. If they're hurt, heal them.
	let healTarget = creep.pos.findClosestByPath(FIND_MY_CREEPS, { ignoreCreeps: true,
		filter: function (t)
		{
			return t != creep && t.hits < t.hitsMax
		}
	});

	//if healing target then go in for the heal
	if (healTarget)
	{
		creep.moveTo(healTarget);
		creep.heal(healTarget);
	}
	else
	{
		let targets = creep.room.find(FIND_HOSTILE_CREEPS);
		//if there are hostile targets stay near the action
		if (targets.length)
		{
			let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { ignoreCreeps: true});

			if (target)
			{
				if (target.pos.inRangeTo(creep.pos, 2))
				{
					creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y);
				}
				else if (target.pos.inRangeTo(creep.pos, 3))
				{
					creep.rangedAttack(target);
				}
				else
				{
					creep.moveTo(target);
				}
			}

		} //go back home if it is boring
		else
		{
			creep.rendezvous(creep, 3);
		}
	}
};
//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobHeal();