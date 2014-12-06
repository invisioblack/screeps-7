var _ = require('lodash');

var jobBuild = require('jobBuild')();
var jobGuard = require('jobGuard')();
var jobHarvest = require('jobHarvest')();
var jobHeal = require('jobHeal')();
var jobRangedGuard = require('jobRangedGuard')();
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
				jobGuard.work(creep);
			}
			else if (creep.memory.job == 'rangedGuard')
			{
				jobRangedGuard.work(creep);
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
    		
    		if (jobManager.creepHasMeans(creep, 'attack'))
    		{
    			creep.memory.job = 'guard';
    		}

			if (jobManager.creepHasMeans(creep, 'rangedAttack'))
    		{
    			creep.memory.job = 'rangedGuard';
    		}
    		
    		if (jobManager.creepHasMeans(creep, 'build'))
    		{
    			if (jobManager.countUnitsWithJob('harvest', creep.memory.spawn) > 3 
    					&& creep.room.find(Game.CONSTRUCTION_SITES).length > 0 
    					&& jobManager.countUnitWithMeans('attack', creep.memory.spawn) > 3
    					&& jobManager.countUnitWithMeans('rangedAttack', creep.memory.spawn) > 1
    					&& jobManager.countUnitWithMeans('heal', creep.memory.spawn) > 1
    					&& Game.spawns[creep.memory.spawn].energy >= 50)
    			{
    				creep.memory.job = 'build';
    			}
    		}

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

	jobManager.moveToRange = function (creep, target, range)
	{
		if (target.pos.inRangeTo(creep.pos, range - 1)) {
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y );
			return true;
		} else if (target.pos.inRangeTo(creep.pos, range)) {
			return true;
		}
		else {
			creep.moveTo(target);
			return true;
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobManager;
}