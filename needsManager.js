//------------------------------------------------------------------------------
// needsManager
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// modules
//------------------------------------------------------------------------------
var _ = require("lodash");
var C = require('C');
var lib = require("lib")();
var jobManager = require('jobManager')();
var spawnManager = require("spawnManager")();

//------------------------------------------------------------------------------
// Declarations
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// function
//------------------------------------------------------------------------------
module.exports = function ()
{
    //declare base object
	var needsManager = function (){};
	
	//--------------------------------------------------------------------------
	// Declarations

	//--------------------------------------------------------------------------
	// top level functions
	//--------------------------------------------------------------------------
    
	needsManager.updateNeeds = function ()
	{
	    if (typeof Memory.needs == 'undefined')
	    {
	        Memory.needs = {};
        }
        needsManager.updateHarvestNeeds();
        needsManager.updateUnloadNeeds();
      
	};

    // -------------------------------------------------------------------------
    // Update sequence that needs to run on every need, every tick, run last in
    // the need update sequence
    needsManager.updateNeed = function (need)
    {
        // update creepsQueued value
        var queued = _.filter(Memory.spawnq, function (o) { return o.need ==  need.name } );
        need.creepsQueued = _.size(queued);
    };

	//--------------------------------------------------------------------------
	// updateNeeds helper functions
    needsManager.updateHarvestNeeds = function ()
    {
        // ---------------------------------------------------------------------
        // Look for sources to update and create needs for
        
        // loop over rooms -----------------------------------------------------
        for (var x in Game.rooms)
        {
            var r = Game.rooms[x];
            var sources;
            
            console.log('Room ' + r.name);
            
            //loop over sources ------------------------------------------------
            sources = r.find(FIND_SOURCES);
            for (var x in sources)
            {
                var s = sources[x];
                var key, n, c, needed;
                
                console.log("S(" + s.id + ") E:" + s.energy + "/" + s.energyCapacity 
                    + " %" + s.percentFull());
                
                // update need for source --------------------------------------
                key = 'harvest-' + s.id
                if (typeof Memory.needs[key] == "undefined")
                {
                    Memory.needs[key] = {};
                }
                
                n = Memory.needs[key];
                
                // we will start with a basic need here
                n.id = s.id;
                n.self = false;
                n.name = key;
                n.job = C.JOB_HARVEST;
                n.scope = C.NEED_SCOPE_ROOM;
                n.weight = C.NEED_WEIGHT_HIGH;
                n.target = s.id;
                
                // make sure assigned creeps is initalized
                if (typeof n.assigned == "undefined")
                {
                    n.assigned = {};
                }
                
                // make sure queued property is initalized
                if (typeof n.queued == "undefined")
                {
                    n.queued = 0;
                }
                
                // purge creeps assigned that no longer exist
                for (var x in n.assigned)
                {
                    if (lib.isNull(Game.creeps[n.assigned[x]]))
                    {
                        delete n.assigned[x];
                    }
                }
                
                // update needed number
                n.needed = s.harvestersNeeded() - n.queued - _.size(n.assigned.length);
                console.log("Needed: " + n.needed);
                
            }
        }
        
        // ---------------------------------------------------------------------
        // purge needs associated with non-existing sources
        // TODO!!!
        
    };
    
    needsManager.updateCollectionNeeds = function ()
    {
        // create collection need for energy on the ground
        // clean up collection need for energy that no longer exists on ground
        // create / clean up collection need for energy on creeps
        
    };
    
    needsManager.updateUnloadNeeds = function ()
    {
        _.forEach(Game.creeps, function (creep, key) 
        {
            var needId = "unload-" + creep.id;
            console.log("Unload need : " + needId);
            if (creep.carrying() > 0)
            {
                console.log("++Unload need : " + needId);
                if (lib.isNull(Memory.needs[needId]))
                {
                    Memory.needs[needId] = {};
                }
                var need = Memory.needs[needId];
                // we will start with a basic need here
                need.id = creep.id;
                need.self = true;
                need.name = needId;
                need.job = C.JOB_UNLOAD;
                need.scope = C.NEED_SCOPE_UNIT;
                
                // set up need weight
                var full = creep.percentFull();
                if (full < 25)
                {
                    need.weight = C.NEED_WEIGHT_TRIVIAL;
                } 
                else if (full < 50)
                {
                    need.weight = C.NEED_WEIGHT_LOW;
                }
                else if (full < 75)
                {
                    need.weight = C.NEED_WEIGHT_MEDIUM;
                }
                else if (full < 100)
                {
                    need.weight = C.NEED_WEIGHT_HIGH;
                }
                else
                {
                    need.weight = C.NEED_WEIGHT_CRITICAL;
                }
                // set up the target in the job
                //n.target = null;
            }
            else
            {
                console.log("--Unload need : " + needId);
                delete Memory.needs[needId];
            }
        });
        
        // purge needs with no associated creep
        
        
    };




    // -------------------------------------------------------------------------
    // TOP LEVEL assigned jobs and spawns
    needsManager.manageNeeds = function ()
	{
        var needs;
        // -------------------------------------------------------------------------
        // critical
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_GLOBAL && o.weight == C.NEED_WEIGHT_CRITICAL; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_ROOM && o.weight == C.NEED_WEIGHT_CRITICAL; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_UNIT && o.weight == C.NEED_WEIGHT_CRITICAL; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        // -------------------------------------------------------------------------
        // high
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_GLOBAL && o.weight == C.NEED_WEIGHT_HIGH; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_ROOM && o.weight == C.NEED_WEIGHT_HIGH; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_UNIT && o.weight == C.NEED_WEIGHT_HIGH; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        // -------------------------------------------------------------------------
        // medium
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_GLOBAL && o.weight == C.NEED_WEIGHT_MEDIUM; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_ROOM && o.weight == C.NEED_WEIGHT_MEDIUM; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_UNIT && o.weight == C.NEED_WEIGHT_MEDIUM; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        // -------------------------------------------------------------------------
        // low
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_GLOBAL && o.weight == C.NEED_WEIGHT_LOW; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_ROOM && o.weight == C.NEED_WEIGHT_LOW; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_UNIT && o.weight == C.NEED_WEIGHT_LOW; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        // -------------------------------------------------------------------------
        // trivial
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_GLOBAL && o.weight == C.NEED_WEIGHT_TRIVIAL; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_ROOM && o.weight == C.NEED_WEIGHT_TRIVIAL; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
        
        needs = _.filter(Memory.needs, function(o) { return o.scope == C.NEED_SCOPE_UNIT && o.weight == C.NEED_WEIGHT_TRIVIAL; });
        _.forEach(needs, function (value, key)
        {
            needsManager.manageJobs(value);
            needsManager.manageSpawnQueue(value);
        });
	};
	
	// -------------------------------------------------------------------------
	// assigns creeps to jobs based on the passed list of needs
	needsManager.manageJobs = function (need)
	{
        console.log("Managing " + need.name);

        if (need.self)
        { // self needs
            
            
        }
        else
        { // non-self needs
            var creeps = Game.creeps;
            var needCreeps = _.filter(creeps, function (o) { return o.memory.needId == need.id; } );
            var idleCreeps;
        
            // first assign any creeps to a need that were spawned for it
            _.forEach(needCreeps, function(value, key)
            {
                jobManager.assignCreepToNeed(value, need);
            });
            
            
            if (need.needed > 0)
            {
                idleCreeps = _.filter(creeps, function (o) { return lib.isNull(o.memory.needId) && o.memory.job == C.JOB_NOTHING ; } );
                _.forEach(needCreeps, function(value, key)
                {
                    if (jobManager.creepHasMeans(value, need.job))
                    {
                        jobManager.assignCreepToNeed(value, need);
                    }
                }); 
            }
        }
	};
	
	// -------------------------------------------------------------------------
	// assigns creeps to spawn based on list of passed needs
	needsManager.manageSpawnQueue = function (need)
	{
	    // self needs never spawn
	    if (need.self)
	        return;
	    
	    // needs are allowed to que things based on their weight
	    // declarations
	    var spawn = false;
	    var creepsNeeded = need.needed;
	    var queueCount = _.size(Memory.spawnq);
	    var creepCount = _.size(Game.creeps);
	    var harvesterCount = jobManager.countUnitWithMeans(C.JOB_HARVEST);
	    var collectorCount = jobManager.countUnitWithMeans(C.JOB_COLLECT);

	    // critical needs can always add everything they want to the spawn queue.
        if (need.weight == C.NEED_WEIGHT_CRITICAL && creepsNeeded > 0)
        {
            spawn = true;
        }

        // high priority items can add one if there is less than 10 in the queue
        // and it has no more than 1 queued
        if (need.weight == C.NEED_WEIGHT_HIGH && queueCount < 10 && need.queued < 2 && creepsNeeded > 0)
        {
            spawn = true;
            creepsNeeded = 1;
        }
        
        // medium priority can only add one, if the queue is less than 10
        // and they don't already have one queued
        if (need.weight == C.NEED_WEIGHT_HIGH && queueCount < 5 && need.queued == 0 && creepsNeeded > 0)
        {
            spawn = true;
            creepsNeeded = 1;
        }
        
        // low and trivial cannot initiate spawns
        
        
        console.log("Need: " + need.name + " Creeps Spawning: " + creepsNeeded + " Spawn: " + spawn);
    
        while (creepsNeeded > 0 && spawn)
        {
            var ncName, nc, unit;
            
            switch (need.job)
    	    {
                case C.JOB_BUILD:
                    unit = "worker";
                    break;
                case C.JOB_COLLECT:
                    unit = "collector";
                    break;
                case C.JOB_GUARD:
                    unit = "guard";
                    break;
                case C.JOB_HARVEST:
                    if (collectorCount == 0)
                    {
                        unit = "drone";
                    } else {
                        unit = "worker";
                    }
                    break;
                case C.JOB_HEAL:
                    unit = "healer";
                    break;
                case C.JOB_RANGED_GUARD:
                    unit = "archer";
                    break;
    	    }

            // set up new spawn
            ncName = spawnManager.generateName(unit);
            Memory.spawnq[ncName] = {};
            nc = Memory.spawnq[ncName];
            nc.unit = unit;
            nc.name = ncName;
            nc.need = need.name;
            // handle counters
            need.needed--;
            need.queued++;
            creepsNeeded--;
        }
	};

	//-------------------------------------------------------------------------
	//return populated object
	return needsManager;
};