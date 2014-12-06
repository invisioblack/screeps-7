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

	//spawn, should be called form main() every tick
	spawnManager.spawn = function ()
	{
		//spawn a harvester if we don't have 3
		var harvesterCount = jobManager.countUnitWithMeans('harvest');
		var guardCount = jobManager.countUnitWithMeans('attack');
		console.log('Total Unit Count - Harvest: ' + harvesterCount + " Guard: " + guardCount);

		for (var x in Game.spawns)
		{
			var spawn = Game.spawns[x];
			console.log('-- spawn: ' + spawn.name);
			
			var sHarvesterCount = jobManager.countUnitWithMeans('harvest', spawn.name);
			var sGuardCount = jobManager.countUnitWithMeans('attack', spawn.name);
			console.log(spawn.name + ' Unit Count - Harvest: ' + sHarvesterCount + " Guard: " + sGuardCount);

			if (sHarvesterCount < 3)
			{
				console.log('Attempting to spawn harvester');
				spawnManager.spawnUnit('harvester', spawn.name);
			} else {
				console.log('Attempting to spawn guard');
				spawnManager.spawnUnit('guard', spawn.name);
			}	
		}

		
	}

	// returns cost for an array of parts
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

	// get the first available spawn owned by player
	spawnManager.getAvailableSpawn = function ()
	{
		for (var x in Game.spawns)
		{
			if (!Game.spawns[x].spawning)
				return Game.spawns[x];
		}
		return false;
	}

	//spawn a unit
	spawnManager.spawnUnit = function (name, spawn)
	{
		if (spawn)
		{
			console.log("Availble spawn: " + spawn);
			console.log(" Energy: " + spawn.energy);
			if (spawn.energy >= spawnManager.getCostParts(units[name].parts))
			{
				//set up the spawn
				var creepName = spawnManager.generateName(name);
				var m = units[name].memory;
				m.spawn = spawn.name;
				//call creating the creep
				console.log(" Creating creep " + name + " : " + creepName);
				spawn.createCreep(units[name].parts, creepName, units[name].memory);
			}
		}
		else
		{
			console.log("No available spawn");
		}
	}

	//generate a name for a spawn
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