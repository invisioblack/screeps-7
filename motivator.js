//-------------------------------------------------------------------------
// Motivator
// The motivator is responsible for managing the highest level decision 
// making. The motivator is the part in which the player interacts with.
// It makes decisions on how resources many resources are allocated to 
// each active motivation.
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// library modules
var C = require('C');
var lib = require('lib');

// game modules
var motivationSupplySpawn = require('motivationSupplySpawn');
var motivationSupplyController = require('motivationSupplyController');
var motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');

var resourceManager = require('resourceManager');
var needManager = require('needManager');
var units = require("units");

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports =
{

	"mode": C.MOTIVATOR_MODE_SINGLE_MINDED,

	//-------------------------------------------------------------------------
	// Main motivator function, should be called first from main
	"motivate": function ()
	{
		var room;
		// set up hack motivations reference -------------------------------------------------------------------
		var motivations = {};
		motivations["motivationSupplySpawn"] = motivationSupplySpawn;
		motivations["motivationSupplyController"] = motivationSupplyController;
		motivations["motivationMaintainInfrastructure"] = motivationMaintainInfrastructure;

		// motivate in each room we control
		for (var roomName in Game.rooms)
		{
			room = Game.rooms[roomName];
			if (room.controller.my)
			{
				//------------------------------------------------------------------------------------------------------
				// motivate
				console.log('+motivator.motivate: ' + roomName);

				// declarations ----------------------------------------------------------------------------------------
				var resources = {};
				var demands = {};
				var sortedMotivations;
				var isSpawnAllocated = false;
				var countActiveMotivations = 0;

				// determine room resources ----------------------------------------------------------------------------
				// energy
				resources.spawnEnergy = resourceManager.getRoomSpawnEnergy(roomName);

				// get room collector status
				resources.controllerStatus = resourceManager.getControllerStatus(roomName);
				console.log('Resources: Spawn Energy: ' + resources.spawnEnergy.energy + '/' + resources.spawnEnergy.energyCapacity + ' Controller Level: ' + resources.controllerStatus.level + ' ' + resources.controllerStatus.progress + '/' + resources.controllerStatus.progressTotal + ' Downgrade: ' + resources.controllerStatus.ticksToDowngrade);

				// units
				resources.units = [];
				for (var unitName in units)
				{
					resources.units[unitName] = {};
					resources.units[unitName].total = resourceManager.countRoomUnits(roomName , unitName);
					resources.units[unitName].allocated = 0; // reset worker allocation
					resources.units[unitName].unallocated = resources.units[unitName].total;
					resources.units[unitName].unassigned = resourceManager.countRoomUnassignedUnits(roomName , unitName);
					resources.units[unitName].assigned = resourceManager.countRoomAssignedUnits(roomName , unitName);
					console.log("Resources: " + unitName + " total: " + resources.units[unitName].total + " Allocated/Unallocated: " + resources.units[unitName].allocated + "/" + resources.units[unitName].unallocated + " Assigned/UnAssigned: " + resources.units[unitName].assigned + "/" + resources.units[unitName].unassigned);
				}

				// -----------------------------------------------------------------------------------------------------
				// process motivations in order of priority ------------------------------------------------------------
				// get sorted motivations
				sortedMotivations = _.sortByOrder(room.memory.motivations, ['priority'], ['desc']);

				// first round motivation processing--------------------------------------------------------------------
				// set up demands and spawning
				sortedMotivations.forEach(function(motivationMemory)
				{
					console.log("+Motivating round 1: " + motivationMemory.name);

					// set up demands ----------------------------------------------------------------------------------
					demands[motivationMemory.name] = motivations[motivationMemory.name].getDemands(roomName , resources);

					// decide which motivations should be active -------------------------------------------------------
					if (demands[motivationMemory.name].energy > 0)
						motivationMemory.active = true;
					else
						motivationMemory.active = false;

					// allocate spawn ----------------------------------------------------------------------------------
					if (!isSpawnAllocated && motivationMemory.active && demands[motivationMemory.name].spawn > 0)
					{
						motivationMemory.spawnAllocated = true;
						isSpawnAllocated = true;
					}
					else
					{
						motivationMemory.spawnAllocated = false;
					}

					// spawn units if allocated spawn ------------------------------------------------------------------
					var unitName = motivations[motivationMemory.name].desiredSpawnUnit();
					if (motivationMemory.spawnAllocated)
					{
						// TODO: assign the spawn dynamically
						if (unitName == "worker" && resourceManager.countRoomUnits(roomName, unitName) < 2)
							Game.spawns.Spawn1.spawnUnit(unitName, false);
						else
							Game.spawns.Spawn1.spawnUnit(unitName, true);
					}
				}, this);

				// second round motivation processing ------------------------------------------------------------------
				// unit allocation and need processing
				countActiveMotivations = this.countActiveMotivations(roomName);

				console.log("-----: Active Motivations: " + countActiveMotivations);

				// iterate over motivations ----------------------------------------------------------------------------
				// TODO: This needs to loop over unit types
				var iteration = 1;
				var totalShares = countActiveMotivations * (countActiveMotivations + 1) / 2;
				var totalUnits = resources.units["worker"].unallocated;

				sortedMotivations.forEach(function(motivationMemory) {
					console.log("+Motivating round 2: " + motivationMemory.name + " ----------------");
					// allocate units ----------------------------------------------------------------------------------
					if (motivationMemory.active)
					{
						var unitsAvailable = resources.units["worker"].unallocated;
						var unitsDemanded = demands[motivationMemory.name].units["worker"];
						var unitsToAllocate;
						var sharesThisIteration = countActiveMotivations - (iteration - 1);
						var unitsPerShare = Math.ceil(totalUnits / totalShares);

						// Determine how many units to allocate to this motivation
						unitsToAllocate = unitsPerShare * sharesThisIteration;
						if (unitsDemanded < unitsToAllocate)
							unitsToAllocate = unitsDemanded;
						if (unitsAvailable < unitsToAllocate)
							unitsToAllocate = unitsAvailable;

						// allocate units
						motivationMemory.allocatedUnits["worker"] = unitsToAllocate;

						// output status -------------------------------------------------------------------------------
						console.log('Pre: Worker Allocation: ' + resources.units["worker"].allocated + '/' + resources.units["worker"].total + ' Unallocated: ' + resources.units["worker"].unallocated);
						console.log("Units Available: " + unitsAvailable + " Units Demanded: " + unitsDemanded + " Units To Allocate: " + unitsToAllocate);
						console.log("Iteration: " + iteration + " Shares this iteration " + sharesThisIteration + " Units/Share: " + unitsPerShare);

						// update resources.units["worker"].unallocated
						resources.units["worker"].allocated += motivationMemory.allocatedUnits['worker'];
						resources.units["worker"].unallocated -= motivationMemory.allocatedUnits['worker'];
						console.log('Worker Allocation: ' + resources.units["worker"].allocated + '/' + resources.units["worker"].total + ' Unallocated: ' + resources.units["worker"].unallocated);
					}

					// processes needs for motivation ------------------------------------------------------------------
					needManager.manageNeeds(roomName, motivations[motivationMemory.name], motivationMemory);

					// fulfill needs -----------------------------------------------------------------------------------
					needManager.fulfillNeeds(roomName);
					iteration++;
				}, this);
			}
		}
	},

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
				motivationSupplySpawn.init(room.name);
				room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_2;

				motivationSupplyController.init(room.name);
				room.memory.motivations[motivationSupplyController.name].priority = C.PRIORITY_1;

				motivationMaintainInfrastructure.init(room.name);
				room.memory.motivations[motivationMaintainInfrastructure.name].priority = C.PRIORITY_3;
			}
		}
	},

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