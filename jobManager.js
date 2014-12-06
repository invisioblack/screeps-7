var _ = require('lodash');

var jobAttackHostile = require('jobAttackHostile')();
var jobHarvest = require('jobHarvest')();
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

		}	
	}

	jobManager.assignJobs = function ()
	{
		for(var i in Game.creeps) 
		{
    		if (jobManager.creepHasMeans(Game.creeps[i], "harvest"))
    		{
    			Game.creeps[i].memory.job = "harvest";	
    		}
    		else if (jobManager.creepHasMeans(Game.creeps[i], "attack"))
    		{
    			Game.creeps[i].memory.job = "guard";
    		}
    		else
    		{
    			Game.creeps[i].memory.job = "nothing";
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

	jobManager.countUnitWithMeans = function (mean)
	{
		var result = 0;
		for(var i in Game.creeps) 
		{
			if (jobManager.creepHasMeans(Game.creeps[i], mean))
				result++;
		}
		return result;
	}

	//-------------------------------------------------------------------------
	//return populated object
	return jobManager;
}