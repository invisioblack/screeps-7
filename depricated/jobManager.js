//-------------------------------------------------------------------------
// jobManager
// This is depricated - 11/22/2016
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var _ = require('lodash');
var C = require('C');
var lib = require('lib')();
var jobs = require('jobs');
var jobBuild = require('jobBuild')();
var jobCollect = require('jobCollect')();
var jobGuard = require('jobGuard')();
var jobHarvest = require('jobHarvest')();
var jobHeal = require('jobHeal')();
var jobRangedGuard = require('jobRangedGuard')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = function ()
{
	//declare base object
	var jobManager = function ()
	{
	};
	//-------------------------------------------------------------------------

	jobManager.actionJobs = function ()
	{
		for (var i in Game.creeps)
		{
			var creep = Game.creeps[i];
			switch (creep.memory.job)
			{
				case C.JOB_BUILD:
					jobBuild.work(creep);
					break;
				case C.JOB_COLLECT:
					jobCollect.work(creep);
					break;
				case C.JOB_GUARD:
					jobGuard.work(creep);
					break;
				case C.JOB_HARVEST:
					jobHarvest.work(creep);
					break;
				case C.JOB_HEAL:
					jobHeal.work(creep);
					break;
				case C.JOB_RANGED_GUARD:
					jobRangedGuard.work(creep);
					break;
			}
		}
	};
	
	jobManager.assignCreepToNeed = function (creep, need)
	{
	    jobManager.unAssignCreep(creep);
	    console.log("+++Assigning : " + creep.name + " to : " + need.name);
	    need.assigned[creep.name] = creep.name;
	    creep.memory.need = need.name;
	    creep.memory.job = need.job;
	    creep.memory.target = need.target;
	    creep.memory.needId = null;
	}
	
	jobManager.unAssignCreep = function (creep)
	{
	    console.log("-UnAssigning : " + creep.name);
	    if (!lib.isNull(creep.need))
	    {
	        var need = Memory.needs[creep.need];
	        if (!lib.isNull(need))
	        {
	            delete need.assigned[creep.name];
	        }
	    }
	    creep.memory.need = null;
	    creep.memory.job = C.JOB_NOTHING;
	    creep.memory.target = null;
	}

	jobManager.creepHasMeans = function (creep, mean)
	{
		var creepParts = [];
		for (var x in creep.body)
		{
			creepParts[x] = creep.body[x].type;
		}

		//console.log('mean: ' + mean);
		//console.log('job means: ' + jobs[mean].means);
		//console.log('creep parts: ' + creepParts);
		var result = _.difference(jobs[mean].means, creepParts);
		//console.log('result: ' + result);

		return !result.length;
	};

	jobManager.countUnitWithMeans = function (mean)
	{
		var result = 0;
		for (var i in Game.creeps)
		{
			var creep = Game.creeps[i];
			if (jobManager.creepHasMeans(creep, mean))
			{
				result++;
			}
		}
		return result;
	};

	jobManager.countUnitsWithJob = function (job)
	{
		var result = 0;
		for (var i in Game.creeps)
		{
			var creep = Game.creeps[i];
			if (creep.memory.job == job)
			{
				result++;
			}
		}
		return result;
	};

	//-------------------------------------------------------------------------
	//return populated object
	return jobManager;
};