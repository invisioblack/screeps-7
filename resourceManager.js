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
	    var result = this.getRoomCreeps(roomName).length;

	    return result;
    },

	"getRoomCreeps": function (roomName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName;
		});
		return result;
	},

	"countRoomUnits": function (roomName, unitName)
	{
		var result = this.getRoomUnits(roomName, unitName).length;
		return result;
	},

	"getRoomUnits": function (roomName, unitName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.unit == unitName;
		});
		return result;
	},

	"countRoomMotivationCreeps": function (roomName, motivationName)
	{
		var result = this.getRoomMotivationCreeps(roomName, motivationName).length;
		return result;
	},

	"getRoomMotivationCreeps": function (roomName, motivationName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName;
		});
		return result;
	},

	"countRoomMotivationUnits": function (roomName, motivationName, unitName)
	{
		var result = this.getRoomMotivationUnits(roomName, motivationName, unitName).length;
		return result;
	},

	"getRoomMotivationUnits": function (roomName, motivationName, unitName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.unit == unitName;
		});
		return result;
	},

	"countRoomMotivationNeedCreeps": function (roomName, motivationName, needName)
	{
		var result = this.getRoomMotivationNeedCreeps(roomName, motivationName, needName).length;
		return result;
	},

	"getRoomMotivationNeedCreeps": function (roomName, motivationName, needName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.motive.need == needName;
		});
		return result;
	},

	"countRoomMotivationNeedUnits": function (roomName, motivationName, needName, unitName)
	{
		var result = this.getRoomMotivationNeedUnits(roomName, motivationName, needName, unitName).length;
		return result;
	},

	"getRoomMotivationNeedUnits": function (roomName, motivationName, needName, unitName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.motive.need == needName
				&& creep.memory.unit == unitName;
		});
		return result;
	},

	"countRoomAssignedUnits": function (roomName, unitName)
	{
		var result = this.getRoomAssignedUnits(roomName, unitName).length;
		return result;
	},

	"getRoomAssignedUnits": function (roomName, unitName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.motive.motivation != ""
				&& creep.memory.motive.need != ""
				&& creep.memory.unit == unitName;
		});
		return result;
	},

	"countRoomUnassignedUnits": function (roomName, unitName)
	{
		var result = this.getRoomUnassignedUnits(roomName, unitName).length;
		return result;
	},

	"getRoomUnassignedUnits": function (roomName, unitName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.motive.motivation == ""
				&& creep.memory.motive.need == ""
				&& creep.memory.unit == unitName;
		});
		return result;
	},


	"countCreepsOnSource": function (roomName, sourceId)
	{
		var result = this.getCreepsOnSource(roomName, sourceId).length;
		return result;
	},

	"getCreepsOnSource": function (roomName, sourceId)
	{
		var result = _.filter(Game.creeps, function (creep) {
			var need = Game.rooms[creep.room.name].memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
			return (creep.room.name == roomName
					&& creep.memory.motive.motivation != ""
					&& creep.memory.motive.need != ""
				) && (
					(!lib.isNull(need) && !lib.isNull(need.sourceId))
					&&
					(!lib.isNull(creep.memory.job) && need.sourceId == sourceId && creep.memory.job.mode == 0)
				);
		});
		return result;
	},

	"findUnallocatedRoomUnit": function (roomName, unitName)
	{
		return this.findUnallocatedRoomUnits(roomName, unitName)[0];
	},

	"findUnallocatedRoomUnits": function (roomName, unitName)
	{
		var result = _.filter(Game.creeps, function (creep) {
			return creep.room.name == roomName
				&& creep.memory.motive.motivation == ""
				&& creep.memory.motive.need == ""
				&& creep.memory.unit == unitName;
		});
		return result;
	}


};