//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var Job = require("Job.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
var JobGuard = function ()
{
	Job.call(this);
	this.name = "jobGuard";
};

JobGuard.prototype = Object.create(Job.prototype);
JobGuard.prototype.constructor = JobGuard;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobGuard.prototype.work = function (creep)
{
	var targets = creep.room.find(FIND_HOSTILE_CREEPS);
	//console.log(JSON.stringify(targets));
	if (targets.length)
	{
		var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { ignoreCreeps: true});
		if (target)
		{
			creep.moveTo(target);
			creep.attack(target);
		}
	}
	else
	{
		creep.rendezvous(creep, 5);
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobGuard();

