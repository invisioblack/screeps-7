//------------------------------------------------------------------------------
// resourceManager
// The resource manager is responsible for getting information about resource
// availability.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// modules
//------------------------------------------------------------------------------
var C = require('C');
var lib = require("lib");

//------------------------------------------------------------------------------
// Declarations
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// function
//------------------------------------------------------------------------------
module.exports = 
{
	//--------------------------------------------------------------------------
	// Declarations
    //--------------------------------------------------------------------------

	//--------------------------------------------------------------------------
	// top level functions
	//--------------------------------------------------------------------------
    "getRoomSpawnEnergy": function (roomName)
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
    },

    "getCollectorStatus": function (roomName)
    {
    	var result = {};
    	
    	// Enumerate over spawns
    	var controller = Game.rooms[roomName].controller;
		result.progress = controller.progress;
    	result.progressTotal = controller.progressTotal;
    	result.ticksToDowngrade = controller.ticksToDowngrade;
    	result.level = controller.level;

	    console.log('Collector Level: ' + result.level + ' ' + result.progress + '/' + result.progressTotal + ' Downgrade: ' + result.ticksToDowngrade);

    	return result;
    },

    "countRoomCreeps": function (roomName)
    {
	    var result = 0;
	    for (var creepName in Game.creeps)
	    {
		    var creep = Game.creeps[creepName];
		    if (creep.room.name == roomName)
		    {
			    result++;
		    }
	    }

	    return result;
    },

	"countRoomUnits": function (roomName, unitName)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.unit == unitName)
			{
				result++;
			}
		}

		return result;
	},

	"countRoomMotivationCreeps": function (roomName, motivationName)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName)
			{
				result++;
			}
		}

		return result;
	},

	"countRoomMotivationUnits": function (roomName, motivationName, unitName)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.unit == unitName)
			{
				result++;
			}
		}

		return result;
	},

	"countRoomMotivationNeedCreeps": function (roomName, motivationName, needName)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.motive.need == needName)
			{
				result++;
			}
		}

		return result;
	},

	"countRoomMotivationNeedUnits": function (roomName, motivationName, needName, unitName)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.motive.need == needName
				&& creep.memory.unit == unitName)
			{
				result++;
			}
		}

		return result;
	}

};