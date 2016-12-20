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
var units = require("units");
var jobTransfer = require("jobTransfer");
var jobBuild = require("jobBuild");
var jobRepair = require("jobRepair");


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
		//console.log("needManager.manageNeeds: motivation.name: " + motivation.name);
		motivation.updateNeeds(roomName);

		// read up needs sorted by priority
		needs = _.sortByOrder(room.memory.motivations[motivation.name].needs , ['priority'], ['desc']);

		// first we need to figure out if we have any open allocations
		for (var unitName in units)
		{
			var assignedUnits = resourceManager.countRoomMotivationUnits(roomName , motivation.name , unitName);
			var allocatedUnits = motivationMemory.allocatedUnits[unitName];

			// if we have open allocations, we need to find if there is a creep to assign
			var done = false;
			while (!done && assignedUnits < allocatedUnits)
			{
				needs.forEach(function (need)
				{
					// if there is a creep to assign, we need to assign it
					var unitDemands = motivation.needs[need.type].getUnitDemands(roomName , need);
					var creepsAssigned = resourceManager.countRoomMotivationNeedUnits(roomName , motivation.name , need.name , unitName);
					var creepsDemanded = unitDemands[unitName];
					var creep = resourceManager.findUnallocatedRoomUnit(room.name , unitName);

					if (!lib.isNull(creep) && creepsAssigned < creepsDemanded)
					{
						creep.assignMotive(roomName , motivation.name , need.name);
					}
					else
					{
						done = true;
					}
					assignedUnits = resourceManager.countRoomMotivationUnits(roomName , motivation.name , unitName);
				} , this);
			}

			console.log("  Assigned/Allocated " + unitName + ": " + assignedUnits + "/" + allocatedUnits);
		}
	},

	"fulfillNeeds": function (roomName)
	{
		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (creep.room.name == roomName && creep.memory.motive.need != "")
			{
				//console.log("Creep executing need: " + creep.name + " : " + creep.memory.motive.motivation + " : " + creep.memory.motive.need);
				var need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];

				//console.log("Creep: " + creep.name + " m: " + creep.memory.motive.motivation + " n: " + creep.memory.motive.need);

				// deassign motive if we can't find the need
				if (lib.isNull(need))
					creep.deassignMotive();
				else if (lib.isNull(need.type))
					creep.deassignMotive();
				else if (need.type == "needHarvestEnergy")
				{
					//console.log("Creep: " + creep.name + " Working needHarvestEnergy");
					jobTransfer.work(creep);
				}
				else if (need.type == "needBuild")
				{
					//console.log("Creep: " + creep.name + " Working needBuild");
					jobBuild.work(creep);
				}
				else if (need.type == "needRepair")
				{
					//console.log("Creep: " + creep.name + " Working needRepair");
					jobRepair.work(creep);
				}
			}
		}
	}
};