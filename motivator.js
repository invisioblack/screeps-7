//----------------------------------------------------------------------------------------------------------------------
// Motivator
// The motivator is responsible for managing the highest level decision 
// making. The motivator is the part in which the player interacts with.
// It makes decisions on how resources many resources are allocated to 
// each active motivation.
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// modules
//----------------------------------------------------------------------------------------------------------------------
// library modules
var C = require('C');
var lib = require('lib');

// game modules
var motivationSupplySpawn = require('motivationSupplySpawn');
var motivationSupplyController = require('motivationSupplyController');
var motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
var motivationHarvestSource = require("motivationHarvestSource");

var resourceManager = require('resourceManager');
var needManager = require('needManager');
var units = require("units");

//----------------------------------------------------------------------------------------------------------------------
// Declarations
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// function
//----------------------------------------------------------------------------------------------------------------------
module.exports =
{
	//------------------------------------------------------------------------------------------------------------------
	// init, should be called before motivate
	"init": function ()
	{
		// init motivations in each room we control
		for (var roomName in Game.rooms)
		{
			var room = Game.rooms[roomName];
			if (room.controller.my)
			{
				// init motivations in memory
				if (lib.isNull(room.memory.motivations))
				{
					room.memory.motivations = {};
				}

				// init each motivation for this room
				motivationHarvestSource.init(room.name);
				room.memory.motivations[motivationHarvestSource.name].priority = C.PRIORITY_1;

				motivationSupplySpawn.init(room.name);
				var numCreeps = resourceManager.countRoomUnits(roomName, "worker");
				if (numCreeps <= 4)
					room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_2;
				else if (numCreeps < 9)
					room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_4;
				else
					room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_6;

				motivationMaintainInfrastructure.init(room.name);
				room.memory.motivations[motivationMaintainInfrastructure.name].priority = C.PRIORITY_3;

				motivationSupplyController.init(room.name);
				room.memory.motivations[motivationSupplyController.name].priority = C.PRIORITY_5;
			}
		}
	},

	//------------------------------------------------------------------------------------------------------------------
	// Main motivator function, should be called first from main
	"motivate": function ()
	{
		var room;
		// set up hack motivations reference ---------------------------------------------------------------------------
		var motivations = {};
		motivations["motivationSupplySpawn"] = motivationSupplySpawn;
		motivations["motivationSupplyController"] = motivationSupplyController;
		motivations["motivationMaintainInfrastructure"] = motivationMaintainInfrastructure;
		motivations["motivationHarvestSource"] = motivationHarvestSource;

		// motivate in each room we control ----------------------------------------------------------------------------
		for (var roomName in Game.rooms)
		{
			room = Game.rooms[roomName];
			if (room.controller.my)
			{
				//------------------------------------------------------------------------------------------------------
				// motivate
				console.log('-------- motivator.motivate: ' + roomName);

				// declarations ----------------------------------------------------------------------------------------
				var resources = resourceManager.getRoomResources(roomName); // get room resources
				var demands = {};
				var sortedMotivations;
				var isSpawnAllocated = false;
				var countActiveMotivations = 0;

				// -----------------------------------------------------------------------------------------------------
				// process motivations in order of priority ------------------------------------------------------------
				// get sorted motivations
				sortedMotivations = _.sortByOrder(room.memory.motivations, ['priority'], ['desc']);

				// first round motivation processing--------------------------------------------------------------------
				// set up demands, active and spawning
				sortedMotivations.forEach(function(motivationMemory)
				{
					console.log("---- Motivating round 1 - demands/spawn/active: " + motivationMemory.name);

					// set up demands ----------------------------------------------------------------------------------
					demands[motivationMemory.name] = motivations[motivationMemory.name].getDemands(roomName , resources);

					// decide which motivations should be active -------------------------------------------------------
					motivations[motivationMemory.name].updateActive(roomName, demands[motivationMemory.name]);

					// allocate spawn ----------------------------------------------------------------------------------
					if (!isSpawnAllocated && demands[motivationMemory.name].spawn)
					{
						motivationMemory.spawnAllocated = true;
						isSpawnAllocated = true;
					}
					else
					{
						motivationMemory.spawnAllocated = false;
					}

					console.log("  Spawn allocated: " + motivationMemory.spawnAllocated);

					// spawn units if allocated spawn ------------------------------------------------------------------
					var unitName = motivations[motivationMemory.name].getDesiredSpawnUnit();
					if (motivationMemory.spawnAllocated)
					{
						for (var spawnName in Game.spawns)
						{
							var spawn = Game.spawns[spawnName];
							// this probably isn't handling multiple spawns well
							if (spawn.room.name == roomName)
							{
								if (unitName == "worker" && resourceManager.countRoomUnits(roomName , unitName) < 2)
									spawn.spawnUnit(unitName , false);
								else
									spawn.spawnUnit(unitName , true);
							}
						}
					}
				}, this);

				// second and 3rd round motivation processing ----------------------------------------------------------
				// unit allocation and need processing
				countActiveMotivations = this.countActiveMotivations(roomName);
				console.log("--: Active Motivations: " + countActiveMotivations);

				// process round 2 and 3 for each unit type ------------------------------------------------------------
				for (var unitName in units)
				{
					console.log("Motivating unit: " + unitName);
					// round 2, regular allocation ---------------------------------------------------------------------
					var iteration = 1;
					var totalShares = countActiveMotivations * (countActiveMotivations + 1) / 2;
					var totalUnits = resources.units[unitName].unallocated;

					sortedMotivations.forEach(function (motivationMemory)
					{
						console.log("---- Motivating round 2 - regular allocation: " + unitName + " : " + motivationMemory.name);
						// allocate units ------------------------------------------------------------------------------
						if (motivationMemory.active)
						{
							var unitsAvailable;
							var unitsAllocated;
							var rawUnitsDemanded;
							var unitsDemanded;
							var unitsToAllocate;
							var sharesThisIteration;
							var unitsPerShare;

							unitsAvailable = lib.nullProtect(resources.units[unitName].unallocated, 0);
							unitsAllocated = lib.nullProtect(motivationMemory.allocatedUnits[unitName], 0);
							rawUnitsDemanded = lib.nullProtect(demands[motivationMemory.name].units[unitName], 0);
							unitsDemanded = rawUnitsDemanded - unitsAllocated;
							sharesThisIteration = countActiveMotivations - (iteration - 1);
							unitsPerShare = totalUnits / totalShares;

							// Determine how many units to allocate to this motivation
							unitsToAllocate = Math.floor(unitsPerShare * sharesThisIteration);
							if (unitsToAllocate == 0)
								unitsToAllocate = 1;
							if (unitsDemanded < unitsToAllocate)
								unitsToAllocate = unitsDemanded;
							if (unitsAvailable < unitsToAllocate)
								unitsToAllocate = unitsAvailable;
							if (unitsToAllocate > unitsAvailable)
								unitsToAllocate = unitsAvailable;

							// allocate units
							motivationMemory.allocatedUnits[unitName] = unitsToAllocate;

							// output status ---------------------------------------------------------------------------
							//console.log("Pre: " + unitName + " Allocation: " + resources.units[unitName].allocated + '/' + resources.units[unitName].total + ' Unallocated: ' + resources.units[unitName].unallocated);
							console.log("  " + unitName + ": Units Available: " + unitsAvailable + " Units Allocated/Demanded-Allocated: " + unitsToAllocate + "/" + unitsDemanded);
							console.log("  " + unitName + ": Iteration: " + iteration + " Shares this iteration " + sharesThisIteration + " Units/Share: " + unitsPerShare);

							// update resources.units["worker"].unallocated
							resources.units[unitName].allocated += motivationMemory.allocatedUnits[unitName];
							resources.units[unitName].unallocated -= motivationMemory.allocatedUnits[unitName];
							console.log("  " + unitName + ': Allocation: ' + resources.units[unitName].allocated + '/' + resources.units[unitName].total + ' Unallocated: ' + resources.units[unitName].unallocated);

							// hack
							if (rawUnitsDemanded == 0)
								iteration--;
						} else {
							motivationMemory.allocatedUnits[unitName] = 0;
						}


						iteration++;
					} , this);

					// motivation round 3 ------------------------------------------------------------------------------
					var totalUnitsAvailable = lib.nullProtect(resources.units[unitName].unallocated, 0);
					var totalUnitsDemanded = 0;
					var totalUnitsAllocated = 0;

					sortedMotivations.forEach(function (motivationMemory)
					{
						if (motivationMemory.active)
						{
							totalUnitsDemanded += lib.nullProtect(demands[motivationMemory.name].units[unitName], 0);
							totalUnitsAllocated += lib.nullProtect(motivationMemory.allocatedUnits[unitName], 0);
						}
					} , this);

					//console.log("-------PREALLOCATION: totalUnitsAvailable: " + totalUnitsAvailable + " totalUnitsDemanded: " + totalUnitsDemanded + " totalUnitsAllocated: " + totalUnitsAllocated);
					while (totalUnitsAvailable > 0 && (totalUnitsDemanded - totalUnitsAllocated) > 0)
					{
						sortedMotivations.forEach(function (motivationMemory)
						{
							console.log("---- Motivating round 3 - surplus allocation: " + unitName + " : " + motivationMemory.name);
							if (motivationMemory.active)
							{

								var unitsAvailable = lib.nullProtect(resources.units[unitName].unallocated, 0);
								var unitsAllocated = lib.nullProtect(motivationMemory.allocatedUnits[unitName], 0);
								var unitsDemanded = lib.nullProtect(demands[motivationMemory.name].units[unitName], 0) - unitsAllocated;

								if (unitsDemanded < 0)
									unitsDemanded = 0;

								console.log("  " + unitName + "Available/Demanded-Allocated/Allocated units: " + unitsAvailable + "/" + unitsDemanded + "/" + unitsAllocated);

								// allocate an additional unit if it is needed
								if (unitsAvailable > 0 && unitsDemanded > 0)
								{
									console.log("  +Allocating additional unit:" + unitName);
									motivationMemory.allocatedUnits[unitName] += 1;
									resources.units[unitName].allocated += 1;
									resources.units[unitName].unallocated -= 1;
								}
							}
						} , this);

						// update values for iteration
						totalUnitsAvailable = resources.units[unitName].unallocated;
						totalUnitsDemanded = 0;
						totalUnitsAllocated = 0;
						sortedMotivations.forEach(function (motivationMemory)
						{
							if (motivationMemory.active)
							{
								totalUnitsDemanded += lib.nullProtect(demands[motivationMemory.name].units[unitName], 0);
								totalUnitsAllocated += lib.nullProtect(motivationMemory.allocatedUnits[unitName], 0);
							}
						} , this);
						//console.log("-------POSTALLOCATION: totalUnitsAvailable: " + totalUnitsAvailable + " totalUnitsDemanded: " + totalUnitsDemanded + " totalUnitsAllocated: " + totalUnitsAllocated);
					}

					console.log(">>>>Final " + unitName + " Allocation: " + resources.units[unitName].allocated + "/" + resources.units[unitName].total + " Unallocated: " + resources.units[unitName].unallocated);
				}

				// motivation round 4 ----------------------------------------------------------------------------------
				console.log(">>>> Final Motivation Round <<<<");
				sortedMotivations.forEach(function(motivationMemory) {
					console.log("---- Motivating round 4 - manage needs: " + motivationMemory.name + " Active: " + motivationMemory.active);
					// processes needs for motivation ------------------------------------------------------------------
					needManager.manageNeeds(roomName, motivations[motivationMemory.name], motivationMemory);
				}, this);

				// fulfill needs ---------------------------------------------------------------------------------------
				needManager.fulfillNeeds(roomName);
			}
		}
	},

	// helper functions ------------------------------------------------------------------------------------------------
	"countActiveMotivations": function (roomName)
	{
		var result = 0;
		for (var motivationName in Game.rooms[roomName].memory.motivations)
		{
			if (Game.rooms[roomName].memory.motivations[motivationName].active)
			{
				result++;
			}
		}

		return result;
	}
};