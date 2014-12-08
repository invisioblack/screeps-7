//-----------------------------------------------------------------------------

var _ = require('lodash');

var C = require('C');
var jobs = require('jobs');
var jobBuild = require('jobBuild')();
var jobCollect = require('jobCollect')();
var jobGuard = require('jobGuard')();
var jobHarvest = require('jobHarvest')();
var jobHeal = require('jobHeal')();
var jobRangedGuard = require('jobRangedGuard')();

module.exports = function()
{
	//declare base object
	var jobManager = function() {};
	//-------------------------------------------------------------------------

	jobManager.actionJobs = function ()
	{
		for(var i in Game.creeps) 
		{
			var creep = Game.creeps[i];
			switch(creep.memory.job)
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
	}

	jobManager.assignJobs = function ()
	{
		for(var i in Game.creeps) 
		{
    		var creep = Game.creeps[i];
    		if (jobManager.creepHasMeans(creep, C.JOB_HARVEST))
    		{
    			creep.memory.job = C.JOB_HARVEST;	
    		}

    		if (jobManager.creepHasMeans(creep, C.JOB_COLLECT))
    		{
    			var dropped = creep.pos.findNearest(Game.DROPPED_ENERGY);
				if (dropped)
				{
					var numDropped = creep.pos.find(Game.DROPPED_ENERGY);
					if (numDropped > jobManager.countUnitsWithJob(C.JOB_COLLECT, '*', creep.room.name))
    					creep.memory.job = C.JOB_COLLECT;
				}
    		}
    		
    		if (jobManager.creepHasMeans(creep, C.JOB_GUARD))
    		{
    			creep.memory.job = C.JOB_GUARD;
    		}

			if (jobManager.creepHasMeans(creep, C.JOB_RANGED_GUARD))
    		{
    			creep.memory.job = C.JOB_RANGED_GUARD;
    		}
    		
    		if (jobManager.creepHasMeans(creep, C.JOB_BUILD))
    		{
    			if (jobManager.countUnitsWithJob(C.JOB_HARVEST, creep.memory.spawn) > 3 && creep.pos.findNearest(Game.CONSTRUCTION_SITES))
    			{
    				creep.memory.job = C.JOB_BUILD;
    			}
    		}

    		if (jobManager.creepHasMeans(creep, C.JOB_HEAL))
    		{
    			creep.memory.job = C.JOB_HEAL;
    		}
		}
	}

	jobManager.creepHasMeans = function (creep, mean)
	{
		var creepParts = [];
		for (var x in creep.body)
		{
			creepParts[x] = creep.body[x].type;
		}

		//console.log('mean: ' + mean);
		//console.log('creep: ' + creepParts);

		var result = _.difference(jobs[mean].means, creepParts);
		//console.log('result: ' + result);
		if (result.length)
			return false;
		else
			return true;
	}

	jobManager.countUnitWithMeans = function (mean, spawnName, roomName)
	{
		if(typeof(spawnName)==='undefined') spawnName = '*';
		if(typeof(roomName)==='undefined') roomName = '*';
		var result = 0;
		for(var i in Game.creeps) 
		{
			var creep = Game.creeps[i];
			if (jobManager.creepHasMeans(creep, mean))
			{
				//test spawn
				if ( (creep.memory.spawn == spawnName || spawnName == '*') 
						&& (creep.room.name == roomName || roomName == '*'))
					result++;
			}
				
		}
		return result;
	}


	jobManager.countUnitsWithJob = function (job, spawnName, roomName)
	{
		if(typeof(spawnName)==='undefined') spawnName = '*';
		if(typeof(roomName)==='undefined') roomName = '*';
		var result = 0;
		for(var i in Game.creeps) 
		{
			var creep = Game.creeps[i];
			if (creep.memory.job == job)
			{
				if ( (creep.memory.spawn == spawnName || spawnName == '*') 
					&& (creep.room.name == roomName || roomName == '*'))
					result++;
			}
		}
		return result;
	}

	//-------------------------------------------------------------------------
	//return populated object
	return jobManager;
}