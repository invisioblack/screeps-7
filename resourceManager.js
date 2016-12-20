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

var units = require("units");

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
    "getRoomResources": function (roomName)
    {
	    var resources = {};
    	// determine room resources ----------------------------------------------------------------------------
	    // energy
	    resources.spawnEnergy = this.getRoomSpawnEnergy(roomName);

	    // get room collector status
	    resources.controllerStatus = this.getControllerStatus(roomName);

	    // output info
	    console.log("---- Room Resources: " + roomName);
	    console.log('  Spawn Energy: ' + resources.spawnEnergy.energy + '/' + resources.spawnEnergy.energyCapacity + ' Controller Level: ' + resources.controllerStatus.level + ' ' + resources.controllerStatus.progress + '/' + resources.controllerStatus.progressTotal + ' Downgrade: ' + resources.controllerStatus.ticksToDowngrade);

	    // get unit resources
	    resources.units = [];
	    for (var unitName in units)
	    {
		    resources.units[unitName] = {};
		    resources.units[unitName].total = this.countRoomUnits(roomName , unitName);
		    resources.units[unitName].allocated = 0; // reset worker allocation
		    resources.units[unitName].unallocated = resources.units[unitName].total;
		    resources.units[unitName].unassigned = this.countRoomUnassignedUnits(roomName , unitName);
		    resources.units[unitName].assigned = this.countRoomAssignedUnits(roomName , unitName);
		    console.log("  " + unitName + " total: " + resources.units[unitName].total + " Assigned/UnAssigned: " + resources.units[unitName].assigned + "/" + resources.units[unitName].unassigned);
	    }

	    return resources;
    },

	"getRoomSpawnEnergy": function (roomName)
    {
    	var room = Game.rooms[roomName];
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

	    var extenders = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
	    extenders.forEach(function (ex) {
	    	result.energy += ex.energy;
	    	result.energyCapacity += ex.energyCapacity;
	    }, this);

    	return result;
    },

    "getControllerStatus": function (roomName)
    {
    	var result = {};
    	
    	// Enumerate over spawns
    	var controller = Game.rooms[roomName].controller;
		result.progress = controller.progress;
    	result.progressTotal = controller.progressTotal;
    	result.ticksToDowngrade = controller.ticksToDowngrade;
    	result.level = controller.level;

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
	},

	"countRoomAssignedUnits": function (roomName, unitName)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation != ""
				&& creep.memory.motive.need != ""
				&& creep.memory.unit == unitName)
			{
				result++;
			}
		}

		return result;
	},

	"countRoomUnassignedUnits": function (roomName, unitName)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation == ""
				&& creep.memory.motive.need == ""
				&& creep.memory.unit == unitName)
			{
				result++;
			}
		}

		return result;
	},

	"countCreepsOnSource": function (roomName, sourceId)
	{
		var result = 0;
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation != ""
				&& creep.memory.motive.need != "")
			{
				var need = Game.rooms[creep.room.name].memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
				if (!lib.isNull(need) && !lib.isNull(need.sourceId))
				{
					if (!lib.isNull(creep.memory.job) && need.sourceId == sourceId && creep.memory.job.mode == 0)
						result++;
				}
			}
		}

		return result;
	},

	"findUnallocatedRoomUnit": function (roomName, unitName)
	{
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName
				&& creep.memory.motive.motivation == ""
				&& creep.memory.motive.need == ""
				&& creep.memory.unit == unitName)
			{
				return creep;
			}
		}

		return null;
	}

};