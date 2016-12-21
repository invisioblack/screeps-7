//-------------------------------------------------------------------------
// prototype.job
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require("lib");
//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = function()
{

	var Job = function () {};

	Job.prototype.JOB_MODE_GETENERGY = 0;
	Job.prototype.JOB_MODE_WORK = 1;

	Job.prototype.moveToRange = function (creep, target, range)
	{
		if (target.pos.inRangeTo(creep.pos, range - 1))
		{
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y);
			return true;
		}
		else if (target.pos.inRangeTo(creep.pos, range))
		{
			return true;
		}
		else
		{
			creep.moveTo(target);
			return true;
		}
	};

	return Job;
};