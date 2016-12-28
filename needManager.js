//------------------------------------------------------------------------------
// needManager
// The need manager is responsible for assigning and reassigning needs to the
// resources they need to be fullfilled. In most cases this means assigning a
// creep to fulfill the task, but in some cases it will be things like asking 
// the spawn to build another unit.
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
			var outOfCreeps = false;
			//console.log("Preloop");
			while (!outOfCreeps && assignedUnits < allocatedUnits)
			{

				needs.forEach(function (need)
				{
					//console.log(need.name);


					// if there is a creep to assign, we need to assign it
					var unitDemands = global[need.type].getUnitDemands(roomName , need, motivation.name);
					var creepsDemanded = unitDemands[unitName];
					var creepsAssigned = resourceManager.countRoomMotivationNeedUnits(roomName , motivation.name , need.name , unitName);
					var creep = resourceManager.findUnallocatedRoomUnit(room.name , unitName);

					if (creepsDemanded == 0)
						outOfCreeps = true;

					//console.log("unit: " + unitName + " outOfCreeps: " + outOfCreeps + " assignedUnits: " + assignedUnits + " allocatedUnits " + allocatedUnits);
					//console.log("creepsAssigned: " + creepsAssigned + " creepsDemanded: " + creepsDemanded);


					while (!lib.isNull(creep) && creepsAssigned < creepsDemanded && assignedUnits < allocatedUnits)
					{
						creep.assignMotive(roomName , motivation.name , need.name);

						// update for iteration
						creep = resourceManager.findUnallocatedRoomUnit(room.name , unitName);
						creepsAssigned = resourceManager.countRoomMotivationNeedUnits(roomName , motivation.name , need.name , unitName);
						assignedUnits = resourceManager.countRoomMotivationUnits(roomName , motivation.name , unitName);
						allocatedUnits = motivationMemory.allocatedUnits[unitName];
					}

					// you think you can move this up into the while above, but don't it causes problems on rare iterations
					if (lib.isNull(creep))
						outOfCreeps = true;
				} , this);
			}

			if (assignedUnits || allocatedUnits)
				console.log("    Assigned/Allocated " + unitName + ": " + assignedUnits + "/" + allocatedUnits);
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
				else if (need.type == "needTransferEnergy")
				{
					//console.log("Creep: " + creep.name + " Working needTransferEnergy");
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
				else if (need.type == "needHarvestSource")
				{
					//console.log("Creep: " + creep.name + " Working needHarvestSource");
					jobHarvestSource.work(creep);
				}
			}
		}
	}
};