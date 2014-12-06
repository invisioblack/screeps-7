var jobManager = require('jobManager')();
var spawnManager = require('spawnManager')();

module.exports = function()
{
	//declare base object
	var gameManager = function() {};
	//-------------------------------------------------------------------------

	gameManager.tick = function ()
	{
		//spawn a harvester if we don't have 3
		var harvesterCount = jobManager.countUnitWithMeans("harvester");
		if (harvesterCount < 4)
		{
			console.log('Attempting to spawn harvester -  # harvesters: ' + harvesterCount);
			console.log(spawnManager.spawnUnit('harvester'));
		}

		//assign jobs
		jobManager.assignJobs();

		//action jobs
		jobManager.actionJobs();
	}
	//-------------------------------------------------------------------------
	//return populated object
	return gameManager;
}