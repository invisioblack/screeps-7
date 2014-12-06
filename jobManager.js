var _ = require('lodash');

var jobAttackHostile = require('jobAttackHostile')();
var jobBuild = require('jobBuild')();
var jobHarvest = require('jobHarvest')();
var jobHeal = require('jobHeal')();
var means = require('means');

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
			if (creep.memory.job == 'harvest')
			{
				jobHarvest.work(creep);
			}
			else if (creep.memory.job == 'guard')
			{
				jobAttackHostile.work(creep);
			}
			else if (creep.memory.job == 'build')
			{
				jobBuild.work(creep);
			}
			else if (creep.memory.job == 'heal')
			{
				jobHeal.work(creep);
			}

		}	
	}

	jobManager.assignJobs = function ()
	{
		for(var i in Game.creeps) 
		{
    		var creep = Game.creeps[i];
    		if (jobManager.creepHasMeans(creep, 'harvest'))
    		{
    			creep.memory.job = 'harvest';	
    		}
    		
    		if (jobManager.creepHasMeans(creep, 'attack') && creep.room.find(Game.HOSTILE_CREEPS).length > 0)
    		{
    			creep.memory.job = 'guard';
    		}
    		
    		if (jobManager.creepHasMeans(creep, 'build'))
    		{
    			if (jobManager.countUnitsWithJob('harvest', creep.memory.spawn) > 4 && creep.room.find(Game.CONSTRUCTION_SITES).length > 0)
    			{
    				creep.memory.job = 'build';
    			}
    		}

    		//this should also filter that if there is somone hurt in room
    		if (jobManager.creepHasMeans(creep, 'heal'))
    		{
    			creep.memory.job = 'heal';
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

		//console.log('mean: ' + means[mean]);
		//console.log('creep: ' + creepParts);
		var result = _.difference(means[mean], creepParts);
		//console.log('result: ' + result);
		if (result.length)
			return false;
		else
			return true;
	}

	jobManager.countUnitWithMeans = function (mean, spawnName)
	{
		if(typeof(spawnName)==='undefined') spawnName = '*';
		var result = 0;
		for(var i in Game.creeps) 
		{
			var creep = Game.creeps[i];
			if (jobManager.creepHasMeans(creep, mean))
			{
				if (creep.memory.spawn == spawnName || spawnName == '*')
					result++;
			}
				
		}
		return result;
	}


	jobManager.countUnitsWithJob = function (job, spawnName)
	{
		if(typeof(spawnName)==='undefined') spawnName = '*';
		var result = 0;
		for(var i in Game.creeps) 
		{
			var creep = Game.creeps[i];
			if (creep.memory.job == job)
			{
				if (creep.memory.spawn == spawnName || spawnName == '*')
					result++;
			}
		}
		return result;
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobManager;
}