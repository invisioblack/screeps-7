var means = require('means');
var _ = require('lodash');
var jobHarvest = require('jobHarvest')();

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
		}	
	}

	jobManager.assignJobs = function ()
	{
		for(var i in Game.creeps) 
		{
    		if (jobManager.creepHasMeans(Game.creeps[i]))
    		{
    			Game.creeps[i].memory.job = "harvest";	
    		}
    		else
    		{
    			Game.creeps[i].memory.job = "nothing";
    		}
		}
	}

	jobManager.creepHasMeans = function (creep, mean)
	{
		var result = _.difference(means[mean], creep.body);
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