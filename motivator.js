//----------------------------------------------------------------------------------------------------------------------
// Motivator
// The motivator is responsible for managing the highest level decision 
// making. The motivator is the part in which the player interacts with.
// It makes decisions on how resources many resources are allocated to 
// each active motivation.
//----------------------------------------------------------------------------------------------------------------------

module.exports =
{
	//------------------------------------------------------------------------------------------------------------------
	// init, should be called before motivate
	"init": function ()
	{
		// init motivations in each room we control
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];
			// init motivations in memory
			if (lib.isNull(room.memory.motivations))
			{
				room.memory.motivations = {};
			}

			// init each motivation for this room
			motivationManualTactical.init(room.name);
			room.memory.motivations[motivationManualTactical.name].priority = C.PRIORITY_1;

			motivationHarvestSource.init(room.name);
			room.memory.motivations[motivationHarvestSource.name].priority = C.PRIORITY_1;

			motivationHaulToStorage.init(room.name);
			room.memory.motivations[motivationHaulToStorage.name].priority = C.PRIORITY_2;

			motivationSupplyTower.init(room.name);
			room.memory.motivations[motivationSupplyTower.name].priority = C.PRIORITY_2;

			motivationClaimRoom.init(room.name);
			room.memory.motivations[motivationClaimRoom.name].priority = C.PRIORITY_4;

			motivationGarrison.init(room.name);
			room.memory.motivations[motivationGarrison.name].priority = C.PRIORITY_2;

			motivationLongDistanceHarvest.init(room.name);
			room.memory.motivations[motivationLongDistanceHarvest.name].priority = C.PRIORITY_3;



			motivationSupplySpawn.init(room.name);
			let numWorkers = room.countUnits("worker");
			let numHarvesters = room.countUnits("harvester");
			let numContainers = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; }}).length;

			// normal priority
			if (numWorkers < config.minWorkers)
				room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_3;
			else if (numWorkers < config.medWorkers)
				room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_6;
			else
				room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_8;

			// harvester override
			if (numWorkers >= config.critWorkers && numContainers >= 1 && numHarvesters < numContainers)
				room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_3;

			// defense override
			if (numWorkers >= config.critWorkers && !lib.isNull(room.memory.threat) && room.memory.threat.count > 0)
				room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_3;

			// claim override
			if (numWorkers >= config.minWorkers && room.memory.motivations[motivationClaimRoom.name].spawnAllocated)
				room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_3;


			motivationMaintainInfrastructure.init(room.name);
			room.memory.motivations[motivationMaintainInfrastructure.name].priority = C.PRIORITY_5;

			motivationSupplyController.init(room.name);
			let roomController = room.controller;
			let ticksToDowngrade;
			if (!lib.isNull(roomController))
				ticksToDowngrade = roomController.ticksToDowngrade;
			else
				ticksToDowngrade = 0;

			if (ticksToDowngrade > config.claimTicks)
				room.memory.motivations[motivationSupplyController.name].priority = C.PRIORITY_7;
			else
				room.memory.motivations[motivationSupplyController.name].priority = C.PRIORITY_2;
		}
	},

	//------------------------------------------------------------------------------------------------------------------
	// Main motivator function, should be called first from main
	"motivate": function ()
	{
		let debug = false;
		let room;

		// motivate in each room we control ----------------------------------------------------------------------------
		for (let roomName in Game.rooms)
		{
			room = Game.rooms[roomName];
			//debug = room.name == "W8N3";

			// update defenses -----------------------------------------------------------------------------------------
			room.updateThreat();

			// long distance harvesters --------------------------------------------------------------------------------
			this.sendOffLongDistanceHarvesters(roomName);

			//------------------------------------------------------------------------------------------------------
			// motivate
			lib.log('-------- motivator.motivate: ' + roomName, true);

			// safeMode failsafe
			if (!lib.isNull(room.controller) && room.controller.my)
			{
				room.safeModeFailsafe(roomName);
			}

			// handle lost creeps
			room.handleLostCreeps();

			// declarations ----------------------------------------------------------------------------------------
			let resources = room.getResources(); // get room resources
			let demands = {};
			let sortedMotivations;
			let isSpawnAllocated = false;
			let countActiveMotivations = 0;

			// -----------------------------------------------------------------------------------------------------
			// process motivations in order of priority ------------------------------------------------------------
			// get sorted motivations
			sortedMotivations = _.sortByOrder(room.memory.motivations, ['priority'], ['desc']);

			// first round motivation processing--------------------------------------------------------------------
			// set up demands, active and spawning
			sortedMotivations.forEach(function(motivationMemory)
			{
				// set up demands ----------------------------------------------------------------------------------
				demands[motivationMemory.name] = global[motivationMemory.name].getDemands(roomName , resources);

				// decide which motivations should be active -------------------------------------------------------
				global[motivationMemory.name].updateActive(roomName, demands[motivationMemory.name]);

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

				lib.log("---- Motivating round 1 - demands/spawn/active: " + motivationMemory.name + " Spawn allocated: " + motivationMemory.spawnAllocated, debug);

				// spawn units if allocated spawn ------------------------------------------------------------------
				let unitName = global[motivationMemory.name].getDesiredSpawnUnit(roomName);
				if (motivationMemory.spawnAllocated)
				{
					for (let spawnName in Game.spawns)
					{
						let spawn = Game.spawns[spawnName];
						// this probably isn't handling multiple spawns well
						if (spawn.room.name == roomName)
						{
							let r = Game.rooms[roomName];
							let countUnits = r.countUnits(unitName);
							//console.log(unitName + " " + countUnits);
							if (unitName == "worker" && countUnits < 2)
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
			lib.log("--: Active Motivations: " + countActiveMotivations, debug);

			// process round 2 and 3 for each unit type ------------------------------------------------------------
			for (let unitName in units)
			{
				// -------------------------------------------------------------------------------------------------
				// round 2, regular allocation ---------------------------------------------------------------------
				let iteration = 1;
				let totalShares;
				let totalUnits;
				let activeDemandingMotivations = 0;

				// count how many motivations are active, and demanding units of this type
				sortedMotivations.forEach(function (motivationMemory)
				{
					if (motivationMemory.active && lib.nullProtect(demands[motivationMemory.name].units[unitName], 0) > 0)
						activeDemandingMotivations++;
				}, this);

				lib.log("++++Motivating unit: " + unitName + " for " + activeDemandingMotivations + " motivation(s)", debug);

				totalShares = activeDemandingMotivations * (activeDemandingMotivations + 1) / 2;
				totalUnits = resources.units[unitName].unallocated;

				sortedMotivations.forEach(function (motivationMemory)
				{
					// allocate units ------------------------------------------------------------------------------
					if (motivationMemory.active)
					{

						let unitsAvailable;
						let unitsTotalAllocated;
						let unitsDemanded;
						let unitsToAllocate;
						let sharesThisIteration;
						let unitsPerShare;

						unitsDemanded = lib.nullProtect(demands[motivationMemory.name].units[unitName], 0);

						if (unitsDemanded > 0)
						{
							lib.log("---- Motivating round 2 - regular allocation: " + unitName + " : " + motivationMemory.name, debug);
							unitsAvailable = lib.nullProtect(resources.units[unitName].unallocated , 0);
							unitsTotalAllocated = lib.nullProtect(resources.units[unitName].allocated , 0);

							if (unitsDemanded < 0)
								unitsDemanded = 0;
							sharesThisIteration = activeDemandingMotivations - (iteration - 1);
							unitsPerShare = totalUnits / totalShares;

							// Determine how many units to allocate to this motivation
							unitsToAllocate = Math.floor(unitsPerShare * sharesThisIteration);
							if (unitsToAllocate <= 0)
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
							lib.log("    Total Allocated/Total: " + unitsTotalAllocated + '/' + resources.units[unitName].total
								+ ' Unallocated: ' + resources.units[unitName].unallocated, debug);
							lib.log("    Units Available: " + unitsAvailable
								+ " Units Allocated/Demanded: " + unitsToAllocate + "/" + unitsDemanded, debug);
							lib.log("    Iteration: " + iteration
								+ " Shares this iteration " + sharesThisIteration
								+ " Units/Share: " + unitsPerShare, debug);

							// update resources.units["worker"].unallocated
							resources.units[unitName].allocated += motivationMemory.allocatedUnits[unitName];
							resources.units[unitName].unallocated -= motivationMemory.allocatedUnits[unitName];
							lib.log('    Allocation/Total: ' + resources.units[unitName].allocated + '/' + resources.units[unitName].total + ' Unallocated: ' + resources.units[unitName].unallocated, debug);
						} else { // handle no demands
							iteration--;
							motivationMemory.allocatedUnits[unitName] = 0;
						}
					} else {
						iteration--;
						motivationMemory.allocatedUnits[unitName] = 0;
					}


					iteration++;
				} , this);

				// motivation round 3 ------------------------------------------------------------------------------
				let totalUnitsAvailable = lib.nullProtect(resources.units[unitName].unallocated, 0);
				let totalUnitsDemanded = 0;
				let totalUnitsAllocated = 0;

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
						if (motivationMemory.active)
						{
							lib.log("---- Motivating round 3 - surplus allocation: " + unitName + " : " + motivationMemory.name, debug);
							let unitsAvailable = lib.nullProtect(resources.units[unitName].unallocated, 0);
							let unitsAllocated = lib.nullProtect(motivationMemory.allocatedUnits[unitName], 0);
							let unitsDemanded = lib.nullProtect(demands[motivationMemory.name].units[unitName], 0) - unitsAllocated;

							if (unitsDemanded < 0)
								unitsDemanded = 0;

							lib.log("    " + unitName + "Available/Demanded-Allocated/Allocated units: " + unitsAvailable + "/" + unitsDemanded + "/" + unitsAllocated, debug);

							// allocate an additional unit if it is needed
							if (unitsAvailable > 0 && unitsDemanded > 0)
							{
								lib.log("    +Allocating additional unit:" + unitName, debug);
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

				lib.log(">>>>Final " + unitName + " Allocation: " + resources.units[unitName].allocated + "/" + resources.units[unitName].total + " Unallocated: " + resources.units[unitName].unallocated, debug);
			}

			// motivation round 4 ----------------------------------------------------------------------------------
			lib.log(">>>> Final Motivation Round <<<<", debug);
			sortedMotivations.forEach(function(motivationMemory) {
				lib.log("---- Motivating round 4 - manage needs: " + motivationMemory.name + " Active: " + motivationMemory.active, debug);
				// processes needs for motivation ------------------------------------------------------------------
				needManager.manageNeeds(roomName, global[motivationMemory.name], motivationMemory);
			}, this);

			// fulfill needs ---------------------------------------------------------------------------------------
			needManager.fulfillNeeds(roomName);

			// motivate defense towers -----------------------------------------------------------------------------
			if (room.controller.my)
			{
				room.motivateTowers(roomName);
			}

		}
	},

	// helper functions ------------------------------------------------------------------------------------------------
	"countActiveMotivations": function (roomName)
	{
		let result = 0;
		for (let motivationName in Game.rooms[roomName].memory.motivations)
		{
			if (Game.rooms[roomName].memory.motivations[motivationName].active)
			{
				result++;
			}
		}

		return result;
	},

	"sendOffLongDistanceHarvesters": function (roomName)
	{
		let debug = false;
		let room = Game.rooms[roomName];
		let numWorkers = room.countUnits("worker");
		let storages = room.find(FIND_STRUCTURES, { filter: function (s) {
			return s.structureType == STRUCTURE_STORAGE;
		}});

		// do I have vis on room, does room have a controller
		if (!lib.isNull(room) && !lib.isNull(room.controller))
		{
			lib.log("LR Harvest: " + roomName
				+ " workers/min: " + numWorkers + "/" + config.longRangeHarvestMinWorkers
				+ " storages: " + storages.length
				+ " RCL: " + room.controller.level
				, debug);

			// if we have some workers to send off, do it
			if (room.controller.my
				&& room.controller.level >= 4
				&& storages.length > 0
				&& config.longRangeHarvestMinWorkers < numWorkers)
			{
				let unallocatedWorker = room.findUnallocatedUnit("worker");

				if (!lib.isNull(unallocatedWorker) && _.sum(unallocatedWorker.carry) == 0)
				{
					//lib.log(" Creep: " + JSON.stringify(unallocatedWorker) , debug);
					unallocatedWorker.assignToLongDistanceHarvest();
				}

			}
		}
	}
};