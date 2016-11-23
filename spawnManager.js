//-------------------------------------------------------------------------
// spawnManager
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var _ = require('lodash');
var lib = require('lib')();
var jobManager = require('jobManager')();
var C = require('C');
var units = require('units');

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------
var WORKER_THRESHOLD_MIN = 2;
var GUARD_THRESHOLD_MIN = 2;
var RANGED_GUARD_THRESHOLD_MIN = 1;
var HEALER_THRESHOLD_MIN = 1;

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = function ()
{
	//declare base object
	var spawnManager = function ()
	{
	};
	//-------------------------------------------------------------------------
	// Declarations

	// game costs for spawning parts
	spawnManager.costs = {};
	spawnManager.costs[MOVE] = 50;
	spawnManager.costs[WORK] = 100;
	spawnManager.costs[CARRY] = 50;
	spawnManager.costs[ATTACK] = 80;
	spawnManager.costs[RANGED_ATTACK] = 150;
	spawnManager.costs[HEAL] = 250;
	spawnManager.costs[TOUGH] = 10;
	spawnManager.costs[CLAIM] = 600;

	//-------------------------------------------------------------------------
	// top level functions
	//-------------------------------------------------------------------------

    spawnManager.init = function ()
    {
        if (lib.isNull(Memory.spawnq))
        {
            Memory.spawnq = {};
        }
    };
    
    spawnManager.spawn = function()
    {
        var s, qunit, q, l, need;
        
        q = Memory.spawnq;
        for (var x in q)
        {
            s = spawnManager.getAvailableSpawn();
            l = spawnManager.getSpawnLevel();
            qunit = q[x];
            need = Memory.needs[qunit.need];
            spawnManager.spawnUnit(qunit.name, qunit.unit, l, s, need);
        }
    }

	//-------------------------------------------------------------------------
	// top level helper functions

	// returns cost for an array of parts
	spawnManager.getCostParts = function (parts)
	{
		var result = 0;
		if (parts.length)
		{
			for (var x in parts)
			{
			    //console.log("P: " + parts[x]);
				result += spawnManager.costs[parts[x]];
			}
		}
		return result;
	};

	// get the first available spawn owned by player
	spawnManager.getAvailableSpawn = function ()
	{
	    var s = Game.spawns;
		for (var x in s)
		{
		    var s1 = s[x];
		    var spawning = s1.spawning;
		    // unmark spawning in memory is spawning is not null
		    if (!lib.isNull(spawning) && !lib.isNull(s1.memory.spawning))
		    {
		        s1.memory.spawning = null;
		    }

		    console.log("S: " + s1 + " spawning: " + spawning)
			if (!lib.isNull(s1) && lib.isNull(s1.spawning) && lib.isNull(s1.memory.spawning))
			{
				return s1;
			}
		}
		return false;
	};

	// spawn a unit
	spawnManager.spawnUnit = function (name, unit, level, spawn, need)
	{
		if (!lib.isNull(spawn) && spawn != false)
		{
			var parts = units[unit][level].parts;
			var cost = spawnManager.getCostParts(parts);
			var result = spawn.canCreateCreep(parts, name);
			console.log('+Spawn(level ' + level + ' ' + unit + '/' + name + '): ' + spawn + ' Energy: ' + spawn.energy + '/' + cost);
			if (spawn.energy >= cost && result == 0)
			{
				//set up the spawn
				var m = units[unit][level].memory;
                m.needId = need.id;
                
				//call creating the creep
				result = spawn.createCreep(parts, name, m);
				if (result)
				{
				    console.log('++Creating level ' + level + ' creep ' + unit + ' : ' + name + " result: " + result);
                    // kludge to mark spawning
                    spawn.memory.spawning = name;
                    
                    // remove from queue
				    delete Memory.spawnq[name];
				} else {
				    console.log('--Failed creating level ' + level + ' creep ' + unit + ' : ' + name + " Error: " + result);
				}
			} else {
			    console.log("--Cannot spawn: " + name + " Error: " + result);
			}
			
		}
		else
		{
			console.log('No available spawn');
		}
	};

	// generate a name for a spawn
	spawnManager.generateName = function (name)
	{
		var result = false;
		var x = 1;
		while (!result)
		{
			var found = false;
			var nameTry = name + '-' + x;
			// check for creeps witht hat name
			for (var i in Game.creeps)
			{
				if (Game.creeps[i].name == nameTry)
				{
					found = true;
				}
			}
			
			// check spawn queue
			if (!lib.isNull(Memory.spawnq[nameTry]))
			{
			    found = true;
			}
			
			// handle found
			if (!found)
			{
				return nameTry;
			}
			x++;
		}
	};
	
	spawnManager.getSpawnLevel = function ()
	{
	    return 1;
	}


	//-------------------------------------------------------------------------
	//return populated object
	return spawnManager;
};