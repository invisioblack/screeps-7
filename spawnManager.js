var _ = require('lodash');
var jobManager = require('jobManager')();
var C = require('C');
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
		var workerCount = jobManager.countUnitWithMeans(C.JOB_HARVEST);
		var guardCount = jobManager.countUnitWithMeans(C.JOB_GUARD);
		var rangedGuardCount = jobManager.countUnitWithMeans(C.JOB_RANGED_GUARD);
		var healerCount = jobManager.countUnitWithMeans(C.JOB_HEAL);

		console.log('==Total Unit Count - Worker: ' + workerCount + ' Guard: ' + guardCount + '/' + rangedGuardCount + ' Healer: ' + healerCount);

		for (var x in Game.spawns)
		{
			//count and report
			var spawn = Game.spawns[x];
			var sWorkerCount = jobManager.countUnitWithMeans(C.JOB_HARVEST, spawn.name);
			var sGuardCount = jobManager.countUnitWithMeans(C.JOB_GUARD, spawn.name);
			var sRangedGuardCount = jobManager.countUnitWithMeans(C.JOB_RANGED_GUARD, spawn.name);
			var sHealerCount = jobManager.countUnitWithMeans(C.JOB_HEAL, spawn.name);
			var sWarriorCount = sGuardCount + sRangedGuardCount;
			var sEnemyCount = spawn.room.find(Game.HOSTILE_CREEPS).length;

			console.log('=' + spawn.name + ' Unit Count - Worker: ' + sWorkerCount + ' Guard: ' + sGuardCount + '/' + sRangedGuardCount + ' Healer: ' + sHealerCount);

			//determine spawning needs


			var needs = {};
			needs['worker'] = 0;
			needs['guard'] = 0;
			needs['archer'] = 0;
			needs['healer'] = 0;
			
			//worker need
			if (sWorkerCount < WORKER_THRESHOLD_MIN)
			{
				needs['worker'] = needs['worker'] + (C.NEED_WEIGHT_CRITICAL * (WORKER_THRESHOLD_MIN - sWorkerCount));
			} 
			else if (!jobManager.countUnitsWithJob(C.JOB_BUILD, spawn.name) && spawn.pos.findNearest(Game.CONSTRUCTION_SITES))
			{
				needs['worker'] = needs['worker'] + C.NEED_WEIGHT_HIGH;
			}
			else
			{
				needs['worker'] = needs['worker'] + C.NEED_WEIGHT_LOW;
			}

			//Guard need
			if (sGuardCount < GUARD_THRESHOLD_MIN)
			{
				needs['guard'] = needs['guard'] + (C.NEED_WEIGHT_HIGH * GUARD_THRESHOLD_MIN);
			}
			else
			{
				if (sGuardCount <= sRangedGuardCount)
				{
					needs['guard'] = needs['guard'] + C.NEED_WEIGHT_HIGH;
				}
				else
				{
					needs['guard'] = needs['guard'] + C.NEED_WEIGHT_MEDIUM;
				}
			}

			//rangedGuard need
			if (sGuardCount < GUARD_THRESHOLD_MIN)
			{
				needs['archer'] = needs['archer'] + (C.NEED_WEIGHT_HIGH * RANGED_GUARD_THRESHOLD_MIN);
			}
			else
			{
				if (sRangedGuardCount <= sGuardCount)
				{
					needs['archer'] = needs['archer'] + C.NEED_WEIGHT_HIGH;
				}
			}

			//healer need
			if (sGuardCount < HEALER_THRESHOLD_MIN)
			{
				needs['healer'] = needs['healer'] + (C.NEED_WEIGHT_CRITICAL * HEALER_THRESHOLD_MIN);
			}
			else
			{
				if (sHealerCount <= (sWarriorCount / 4))
				{
					needs['healer'] = needs['healer'] + C.NEED_WEIGHT_HIGH;
				}
			}

			//sort needs and spawn based on what is highest
			var sortedNeeds = [];
			sortedNeeds.push({name: 'worker', val: needs['worker']});
			sortedNeeds.push({name: 'guard', val: needs['guard']});
			sortedNeeds.push({name: 'archer', val: needs['archer']});
			sortedNeeds.push({name: 'healer', val: needs['healer']});
			sortedNeeds.sort(function(a,b) {return b.val - a.val;});

			//spawn the unit
			spawnManager.spawnUnit(sortedNeeds[0].name, spawn);

			//-----------------------------------------------------------------
			//if spawnpoint has less than WORKER_THRESHOLD_MIN and there are builders around, then assign them to this spawn
			if (sWorkerCount < WORKER_THRESHOLD_MIN && jobManager.countUnitsWithJob('build', '*', spawn.room.name))
			{
				var workers = spawn.room.find(Game.MY_CREEPS);
				for (var y in workers)
				{
					var worker = workers[y];
					if (worker.memory.spawn != spawn.name && worker.memory.job == 'build')
					{
						worker.memory.spawn = spawn.name;
						worker.memory.job = C.JOB_HARVEST;
						console.log("+*+" + spawn.name + " assumed control of " + worker.name);
					}
				}
			}
		}
	};

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
	};

	// get the first available spawn owned by player
	spawnManager.getAvailableSpawn = function ()
	{
		for (var x in Game.spawns)
		{
			if (!Game.spawns[x].spawning)
				return Game.spawns[x];
		}
		return false;
	};

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
	};

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
	};

	spawnManager.getSpawnLevel = function (room)
	{
		var numSpawns = room.find(Game.MY_SPAWNS).length;
		var numHarvester = jobManager.countUnitWithMeans(C.JOB_HARVEST, '*', room.name);
		var numWarrior = jobManager.countUnitWithMeans(C.JOB_GUARD, '*', room.name);
		numWarrior += jobManager.countUnitWithMeans(C.JOB_RANGED_GUARD, '*', room.name);

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
	};

	//-------------------------------------------------------------------------
	//return populated object
	return spawnManager;
}