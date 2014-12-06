var jobManager = require('jobManager')();
var units = require('units');

module.exports = function()
{
	//declare base object
	var spawnManager = function() {};
	//-------------------------------------------------------------------------

	//game costs for spawning parts
	spawnManager.costs = {};
	spawnManager.costs[Game.MOVE] = 50; 
	spawnManager.costs[Game.WORK] = 20; 
	spawnManager.costs[Game.CARRY] = 50;
	spawnManager.costs[Game.ATTACK] = 100;
	spawnManager.costs[Game.RANGED_ATTACK] = 150;
	spawnManager.costs[Game.HEAL] = 200;
	spawnManager.costs[Game.TOUGH] = 5;

	//spawn
	spawnManager.spawn = function ()
	{
		//spawn a harvester if we don't have 3
		var harvesterCount = jobManager.countUnitWithMeans('harvest');
		var guardCount = jobManager.countUnitWithMeans('attack');

		console.log('Unit Count - Harvest: ' + harvesterCount + " Guard: " + guardCount);

		if (harvesterCount < 3)
		{
			console.log('Attempting to spawn harvester');
			spawnManager.spawnUnit('harvester');
		} else {
			console.log('Attempting to spawn guard');
			spawnManager.spawnUnit('guard');
		}
	}

	// returns cost for list of parts
	spawnManager.getCostParts = function (parts) {
	    var result = 0;
	    if(parts.length)
	    {
	        for (var x in parts)
	        {
	            result += spawnManager.costs[parts[x]];
	        }
	    }
	    return result;
	}

	spawnManager.getAvailableSpawn = function ()
	{
		for (var x in Game.spawns)
		{
			if (!Game.spawns[x].spawning)
				return Game.spawns[x];
		}
		return false;
	}

	spawnManager.spawnUnit = function (name)
	{
		var spawn = spawnManager.getAvailableSpawn();
		if (spawn)
		{
			console.log("Availble spawn: " + spawn);
			console.log(" Energy: " + spawn.energy);
			if (spawn.energy >= spawnManager.getCostParts(units[name].parts))
			{
				var creepName = spawnManager.generateName(name)
				console.log("creating creep " + name + " : " + creepName);
				spawn.createCreep(units[name].parts, creepName, units[name].memory);
			}
		}
		else
		{
			console.log("No available spawn");
		}
	}

	spawnManager.generateName = function (name)
	{
		var result = false;
		var x = 1;
		while(!result)
		{
			var found = false;
			var nameTry = name + "-" + x;
			for(var i in Game.creeps)
			{
				if (Game.creeps[i].name == nameTry)
				{
					found = true;
				}
			}
			if (!found)
			{
				return nameTry;
			}
			x++;
		}
	}

	//-------------------------------------------------------------------------
	//return populated object
	return spawnManager;
}