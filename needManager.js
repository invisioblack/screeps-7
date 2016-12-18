//------------------------------------------------------------------------------
// needManager
// The need manager is responsible for assigning and reassigning needs to the
// resources they need to be fullfilled. In most cases this means assigning a
// creep to fulfill the task, but in some cases it will be things like asking 
// the spawn to build another unit.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// modules
//------------------------------------------------------------------------------
// library modules
var C = require('C');
var lib = require('lib');
var resourceManager = require("resourceManager");

// game modules
var jobHarvest = require("jobHarvest");

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
	"manageNeeds": function (roomName, motivation, motivationMemory)
	{
		var room = Game.rooms[roomName];
		var needs;

		// create and update needs for motivation
		console.log("needManager.manageNeeds: motivation.name: " + motivation.name);
		motivation.updateNeeds(roomName);
		needs = _.sortBy(room.memory.motivations[motivation.name].needs , ['priority'] , ['asc']);

		// first we need to figure out if we have any open allocations
		// TODO: this needs to dynamically loop over unit types
		var assignedUnits = resourceManager.countRoomMotivationUnits(roomName, motivation.name, "worker");
		var allocatedUnits = motivationMemory.allocatedUnits["worker"];

		console.log("Assigned/Allocated workers: " + assignedUnits + "/" + allocatedUnits);
		// if we have open allocations, we need to find if there is a creep to assign
		var done = false;
		while (!done && assignedUnits < allocatedUnits)
		{
			needs.forEach( function (need) {
				// if there is a creep to assign, we need to assign it
				var creepsAssigned = resourceManager.countRoomMotivationNeedUnits(roomName, motivation.name, need.name, "worker");
				var creepsDemanded = need.unitDemands["worker"];
				var creep = resourceManager.findUnallocatedRoomUnit(room.name, "worker");
				if (!lib.isNull(creep) && creepsAssigned < creepsDemanded)
				{
					console.log(creep);
					creep.memory.motive.motivation = motivation.name;
					creep.memory.motive.need = need.name;
				} else {
					done = true;
				}
				allocatedUnits = resourceManager.countRoomMotivationUnits(roomName, motivation.name, "worker");
			}, this);

		}
	},

	"fulfillNeeds": function (roomName)
	{
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName && creep.memory.motive.need != "")
			{
				console.log("Creep executing need: " + creep.name + " : " + creep.memory.motive.motivation + " : " + creep.memory.motive.need);
				var need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
				if (need.type == "needHarvestEnergy")
				{
					console.log("Working needNarvestEnergy");
					jobHarvest.work(creep);
				}
			}
		}
	}
};