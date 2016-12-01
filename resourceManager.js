//------------------------------------------------------------------------------
// resourceManager
// The resource manager is responsible for getting information about resource
// availability.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// modules
//------------------------------------------------------------------------------
var _ = require("lodash");
var C = require('C');
var lib = require("lib")();

require('prototype.creep')();
require('prototype.source')();
require('prototype.spawn')();

//------------------------------------------------------------------------------
// Declarations
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// function
//------------------------------------------------------------------------------
module.exports = function ()
{
    //declare base object
	var resourceManager = function (){};
	
	//--------------------------------------------------------------------------
	// Declarations
    //--------------------------------------------------------------------------

	//--------------------------------------------------------------------------
	// top level functions
	//--------------------------------------------------------------------------
    resourceManager.getRoomSpawnEnergy = function (roomName)
    {
    	var result = {};
    	result.energy = 0;
    	result.energyCapacity = 0;
    	
    	// Enumerate over spawns
    	for (var spawnName in Game.spawns)
    	{
    		var spawn = Game.spawns[spawnName];
    		if (spawn.room.name == roomName)
    		{
    			result.energy += spawn.energy;
    			result.energyCapacity += spawn.energyCapacity;
    		}
    	}

    	return result;
    };

    resourceManager.getCollectorStatus = function (roomName)
    {
    	var result = {};
    	
    	// Enumerate over spawns
    	var controller = Game.rooms[roomName].controller;
		result.progress = controller.progress;
    	result.progressTotal = controller.progressTotal;
    	result.ticksToDowngrade = controller.ticksToDowngrade;
    	result.level = controller.level;

    	return result;
    };

    resourceManager.getRoomCreeps = function (roomName, unit)
    {
    	var result = 0;
    	for (var creepName in Game.creeps)
    	{
    		var creep = Game.creeps[creepName];
    		if (creep.room.name == roomName && creep.getUnit() == unit)
    		{
    			result++;
    		}
    	}

    	return result;
    };

	//-------------------------------------------------------------------------
	//return populated object
	return resourceManager;
};