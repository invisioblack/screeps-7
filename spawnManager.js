module.exports = function()
{
	//declare base object
	var spawnManager = function() {};

	spawnManager.getAvailableSpawn = function ()
	{
		for (var x in Game.spawns)
		{
			if (!Game.spawns[x].spawning)
				return Game.spawns[x];
		}
		return false;
	}

	//return populated object
	return spawnManager;
}



