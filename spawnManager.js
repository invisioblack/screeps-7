var jobManager = require('jobManager')();
var units = require('units');

var WORKER_THRESHOLD_MIN = 3;
var GUARD_THRESHOLD_MIN = 2;
var RANGED_GUARD_THRESHOLD_MIN = 1;
var HEALER_THRESHOLD_MIN = 1;


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
		var workerCount = jobManager.countUnitWithMeans('harvest');
		var guardCount = jobManager.countUnitWithMeans('attack');
		var rangedGuardCount = jobManager.countUnitWithMeans('rangedAttack');
		var healerCount = jobManager.countUnitWithMeans('heal');

		console.log('==Total Unit Count - Worker: ' + workerCount + ' Guard: ' + guardCount + '/' + rangedGuardCount + ' Healer: ' + healerCount);

		for (var x in Game.spawns)
		{
			var spawn = Game.spawns[x];
			//console.log('-- spawn: ' + spawn.name);
			
			var sWorkerCount = jobManager.countUnitWithMeans('harvest', spawn.name);
			var sGuardCount = jobManager.countUnitWithMeans('attack', spawn.name);
			var sRangedGuardCount = jobManager.countUnitWithMeans('rangedAttack', spawn.name);
			var sHealerCount = jobManager.countUnitWithMeans('heal', spawn.name);

			console.log('=' + spawn.name + ' Unit Count - Worker: ' + sWorkerCount + ' Guard: ' + sGuardCount + '/' + sRangedGuardCount + ' Healer: ' + sHealerCount);

			if (sWorkerCount < WORKER_THRESHOLD_MIN)
			{
				spawnManager.spawnUnit('worker', spawn);
			}
			else if (sGuardCount < GUARD_THRESHOLD_MIN)
			{
				spawnManager.spawnUnit('guard', spawn);	
			}
			else if (sRangedGuardCount < RANGED_GUARD_THRESHOLD_MIN)
			{
				spawnManager.spawnUnit('archer', spawn);	
			}
			else if (sHealerCount < HEALER_THRESHOLD_MIN)
			{
				spawnManager.spawnUnit('healer', spawn);
			}
			else if (sWorkerCount < WORKER_THRESHOLD_MIN + 1)
			{
				spawnManager.spawnUnit('worker', spawn);
			}
			else if (sGuardCount < GUARD_THRESHOLD_MIN + 1)
			{
				spawnManager.spawnUnit('guard', spawn);	
			}
			else if (sRangedGuardCount < RANGED_GUARD_THRESHOLD_MIN + 1)
			{
				spawnManager.spawnUnit('archer', spawn);	
			}
			else if (sHealerCount < HEALER_THRESHOLD_MIN + 1)
			{
				spawnManager.spawnUnit('healer', spawn);
			}
			else
			{
				if (sGuardCount < sWorkerCount && sRangedGuardCount < sWorkerCount)
				{
					if ((sGuardCount + sRangedGuardCount) % 2 === 0)
					{
						spawnManager.spawnUnit('guard', spawn);	
					}
					else
					{
						spawnManager.spawnUnit('archer', spawn);		
					}
				}
				else
				{
					spawnManager.spawnUnit('worker', spawn);
				}
			}

			//if spawnpoint has less than 3 builders and there are builders around, then assign them to this spawn
			if (sWorkerCount < WORKER_THRESHOLD_MIN && jobManager.countUnitsWithJob('build', '*', spawn.room.name))
			{
				var workers = spawn.room.find(Game.MY_CREEPS);
				for (var y in workers)
				{
					var worker = workers[y];
					if (worker.memory.spawn != spawn.name && worker.memory.job == 'build')
					{
						worker.memory.spawn = spawn.name;
						worker.memory.job = 'harvest';
						console.log("+*+" + spawn.name + " assumed control of " + worker.name);
					}
				}
			}
		}
	}

	// returns cost for an array of parts
	spawnManager.getCostParts = function (parts)
	{
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
			
			var spawnLevel = spawnManager.getSpawnLevel(spawn.room);
			var parts = units[name][spawnLevel].parts;
			var cost = spawnManager.getCostParts(parts);
			console.log('+Spawn(level ' + spawnLevel + ' ' + name + '): ' + spawn + ' Energy: ' + spawn.energy + '/' + cost);
			if (spawn.energy >= cost)
			{
				//set up the spawn
				var creepName = spawnManager.generateName(name);
				var m = units[name][spawnLevel].memory;
				m.spawn = spawn.name;
				//call creating the creep
				console.log('++Creating level ' + spawnLevel + ' creep ' + name + ' : ' + creepName);
				spawn.createCreep(parts, creepName, m);
			}
		}
		else
		{
			console.log('No available spawn');
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
			var nameTry = name + '-' + x;
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

	spawnManager.getSpawnLevel = function (room)
	{
		var numSpawns = room.find(Game.MY_SPAWNS).length;
		var numHarvester = jobManager.countUnitWithMeans('harvest', '*', room.name);
		var numWarrior = jobManager.countUnitWithMeans('attack', '*', room.name);
		numWarrior += jobManager.countUnitWithMeans('rangedAttack', '*', room.name);

		if (numSpawns < 2)
		{
			if (numHarvester <= WORKER_THRESHOLD_MIN && numWarrior <= GUARD_THRESHOLD_MIN)
				return 1;
			else
				return 2;
		}
		else
		{
			if (numHarvester <= WORKER_THRESHOLD_MIN * 2 && numWarrior <= GUARD_THRESHOLD_MIN * 2)
				return 2;
			else
				return 3;
		}
	}

	//-------------------------------------------------------------------------
	//return populated object
	return spawnManager;
}