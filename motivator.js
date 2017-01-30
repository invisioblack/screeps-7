//----------------------------------------------------------------------------------------------------------------------
// Motivator
// The motivator is responsible for managing the highest level decision 
// making. The motivator is the part in which the player interacts with.
// It makes decisions on how resources many resources are allocated to 
// each active motivation.
//----------------------------------------------------------------------------------------------------------------------
"use strict";
module.exports =
	{
		//------------------------------------------------------------------------------------------------------------------
		// init, should be called before motivate
		"init": function ()
		{
			cpuManager.timerStart("motivate init" , "motivate.init");
			// init motivations in each room we control
			_.forEach(Game.rooms , (room , roomName) =>
			{
				room.init();

				// init motivations in memory
				if (lib.isNull(room.memory.motivations))
				{
					room.memory.motivations = {};
				}

				/*******************************************************************************************************
				 * CORE
				 */

				// harvestSource ---------------------------------------------------------------------------------------
				if (room.getIsMine() || roomManager.getIsLongDistanceHarvestTarget(room.name))
				{
					motivationHarvestSource.init(room.name);
					room.memory.motivations[motivationHarvestSource.name].priority = C.PRIORITY_1;
				}
				else if (motivationHarvestSource.isInit(room.name))
				{
					motivationHarvestSource.deInit(room.name);
				}

				// haulToStorage ---------------------------------------------------------------------------------------
				if (room.getIsMine() || roomManager.getIsLongDistanceHarvestTarget(room.name))
				{
					motivationHaulToStorage.init(room.name);
					room.memory.motivations[motivationHaulToStorage.name].priority = C.PRIORITY_2;
				}
				else if (motivationHaulToStorage.isInit(room.name))
				{
					motivationHaulToStorage.deInit(room.name);
				}

				// supplySpawn -----------------------------------------------------------------------------------------
				if (room.getIsMine())
				{
					motivationSupplySpawn.init(room.name);
					room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_3;
				}
				else if (motivationSupplySpawn.isInit(room.name))
				{
					motivationSupplySpawn.deInit(room.name);
				}

				// supplyController ------------------------------------------------------------------------------------
				if (room.getIsMine())
				{
					motivationSupplyController.init(room.name);
					room.memory.motivations[motivationSupplyController.name].priority = C.PRIORITY_4;
				}
				else if (motivationSupplyController.isInit(room.name))
				{
					motivationSupplyController.deInit(room.name);
				}

				// longDistanceHarvest ---------------------------------------------------------------------------------
				if (room.getIsMine() && room.memory.mode === C.ROOM_MODE_NORMAL)
				{
					motivationLongDistanceHarvest.init(room.name);
					room.memory.motivations[motivationLongDistanceHarvest.name].priority = C.PRIORITY_5;
				}
				else if (motivationLongDistanceHarvest.isInit(room.name))
				{
					motivationLongDistanceHarvest.deInit(room.name);
				}

				// claimRoom -------------------------------------------------------------------------------------------
				let isClaimed = _.some(Memory.claims , (c) => c.room === room.name);
				if ((room.getIsMine() && room.memory.mode === C.ROOM_MODE_NORMAL) || isClaimed)
				{
					motivationClaimRoom.init(room.name);
					room.memory.motivations[motivationClaimRoom.name].priority = C.PRIORITY_6;
				}
				else if (motivationClaimRoom.isInit(room.name))
				{
					motivationClaimRoom.deInit(room.name);
				}

				// maintainInfrastructure ------------------------------------------------------------------------------
				if (room.getIsMine() || roomManager.getIsLongDistanceHarvestTarget(room.name))
				{
					motivationMaintainInfrastructure.init(room.name);
					room.memory.motivations[motivationMaintainInfrastructure.name].priority = C.PRIORITY_7;
				}
				else if (motivationMaintainInfrastructure.isInit(room.name))
				{
					motivationMaintainInfrastructure.deInit(room.name);
				}

				// harvestMinerals -------------------------------------------------------------------------------------
				if (room.getIsMine() && room.memory.cache.structures[STRUCTURE_EXTRACTOR].length > 0)
				{
					let mineralContainer = Game.getObjectById(room.memory.mineralContainerId);
					let containerTotal = 0;

					motivationHarvestMinerals.init(room.name);
					motivationHaulMinerals.init(room.name);
					room.memory.motivations[motivationHarvestMinerals.name].priority = C.PRIORITY_8;
					room.memory.motivations[motivationHaulMinerals.name].priority = C.PRIORITY_9;

					if (!lib.isNull(mineralContainer))
					{
						containerTotal = _.sum(mineralContainer.store);
					}
					if (containerTotal > 1000)
					{
						room.memory.motivations[motivationHaulMinerals.name].priority = C.PRIORITY_1;
					}

				}
				else if (motivationHarvestMinerals.isInit(room.name))
				{
					motivationHarvestMinerals.deInit(room.name);
					motivationHaulMinerals.deInit(room.name);
				}

				/*******************************************************************************************************
				 * COMBAT
				 */

				// manualTactical --------------------------------------------------------------------------------------
				motivationManualTactical.init(room.name);
				room.memory.motivations[motivationManualTactical.name].priority = C.PRIORITY_1;

				// garrison --------------------------------------------------------------------------------------------
				motivationGarrison.init(room.name);
				room.memory.motivations[motivationGarrison.name].priority = C.PRIORITY_2;

				// supplyTower -----------------------------------------------------------------------------------------
				if (room.getIsMine() && room.memory.cache.structures[STRUCTURE_TOWER].length > 0)
				{
					motivationSupplyTower.init(room.name);
					room.memory.motivations[motivationSupplyTower.name].priority = C.PRIORITY_7;
				}
				else if (motivationSupplyTower.isInit(room.name))
				{
					motivationSupplyTower.deInit(room.name);
				}

				// scout -----------------------------------------------------------------------------------------------
				if (lib.isNull(Memory.scoutTargets))
					Memory.scoutTargets = [];

				if (roomManager.getIsMine(roomName) && _.some(Memory.scoutTargets , {sourceRoom: roomName}))
				{
					motivationScout.init(room.name);
					room.memory.motivations[motivationScout.name].priority = C.PRIORITY_6;
				}
				else if (_.some( Memory.scoutTargets, { targetRoom: roomName } ))
				{
					motivationScout.init(room.name);
					room.memory.motivations[motivationScout.name].priority = C.PRIORITY_1;
				}
				else if (motivationScout.isInit(room.name))
				{
					motivationScout.deInit(room.name);
				}
			});

			/***************************************************************************************************************
			 * update unloaded rooms
			 */
			_.forEach(Memory.rooms , (v , k) =>
			{
				if (lib.isNull(Game.rooms[k]))
				{
					roomManager.updateUnitCache(k);
					roomManager.updateUnitMotiveCache(k);
				}
			});
			cpuManager.timerStop("motivate.init" , config.cpuInitDebug , 1 , 2);
		} ,

		/*******************************************************************************************************************
		 * Main motivator function, should be called first from main
		 */
		"motivate": function ()
		{
			cpuManager.timerStart("motivate" , "motivate");
			let debug = false;
			let room;
			let cpuUsed = 0;

			// motivate in each room we control ----------------------------------------------------------------------------
			cpuManager.timerStart(`\tRoom Total` , "motivate.roomTotal");
			for (let roomName in Game.rooms)
			{
				cpuManager.timerStart(`\tRoom: ${roomLink(roomName)}` , "motivate.room");

				// declarations ----------------------------------------------------------------------------------------
				let sortedMotivations;
				room = Game.rooms[roomName];

				// motivate defense towers -----------------------------------------------------------------------------
				// TODO: Separate out healing from killing on the turrets
				if (room.getIsMine())
				{
					room.motivateTowers(roomName);
					// safeMode failsafe
					room.safeModeFailsafe(roomName);
				}

				// links ---------------------------------------------------------------------------------------------------
				room.motivateLinks();

				// -----------------------------------------------------------------------------------------------------
				// process motivations in order of priority ------------------------------------------------------------
				// get sorted motivations
				sortedMotivations = _.sortByOrder(room.memory.motivations , ['priority'] , ['desc']);

				cpuManager.timerStart(`\t\tMotivate R1` , "motivate.r1");
				this.motivateRound1(sortedMotivations , room);
				cpuManager.timerStop("motivate.r1" , config.cpuMotivateDebug);

				cpuManager.timerStart(`\t\tMotivate R2` , "motivate.r2");
				this.motivateRound2(sortedMotivations , room);
				cpuManager.timerStop("motivate.r2" , config.cpuMotivateDebug);

				cpuManager.timerStop("motivate.room" , config.cpuRoomDebug , 8 , 10);
			}
			cpuManager.timerStop("motivate.roomTotal" , config.cpuRoomDebug , 10 , 20);

			// fulfill needs ---------------------------------------------------------------------------------------
			cpuManager.timerStart("\tFulfill Needs" , "motivate.fulfillNeeds");
			needManager.fulfillNeeds();
			cpuManager.timerStop("motivate.fulfillNeeds" , config.cpuNeedsDebug , 10 , 15);

			cpuManager.timerStop("motivate" , config.cpuMotivateDebug , 25 , 40);
		} ,

		/**
		 * first round motivation processing--------------------------------------------------------------------
		 * set up demands, active and spawning
		 * @param sortedMotivations
		 * @param room {Room}
		 */
		motivateRound1: function (sortedMotivations , room)
		{
			let debug = false;
			let roomName = room.name;
			let isSpawnAllocated = false;

			_.forEach(sortedMotivations , (motivationMemory) =>
			{
				// is motivation active?
				// decide which motivations should be active -------------------------------------------------------
				global[motivationMemory.name].updateActive(roomName);

				if (motivationMemory.active)
				{
					// set up demands ----------------------------------------------------------------------------------
					motivationMemory.demands = global[motivationMemory.name].getDemands(roomName);

					// allocate spawn ----------------------------------------------------------------------------------
					if (!isSpawnAllocated && motivationMemory.demands.spawn)
					{
						motivationMemory.spawnAllocated = true;
						isSpawnAllocated = true;
					}
					else
					{
						motivationMemory.spawnAllocated = false;
					}

					// update needs ------------------------------------------------------------------------------------
					global[motivationMemory.name].updateNeeds(roomName);

					// spawn units if allocated spawn ------------------------------------------------------------------
					// TODO: Spawning needs to be updated, this is terrible.
					// this probably isn't handling multiple spawns well
					if (motivationMemory.spawnAllocated && room.getIsMine())
					{
						_.forEach(Game.spawns , (spawn , spawnName) =>
						{
							if (spawn.room.name === roomName && !spawn.spawning)
							{
								let unitName = global[motivationMemory.name].getDesiredSpawnUnit(roomName);
								spawn.spawnUnit(unitName);
							}
						});
					}

					// debug output
					lib.log(`${roomLink(roomName)}: motivate.r1: ${motivationMemory.name}\tActive: ${motivationMemory.active}\tSpawn demand/allocated:  ${motivationMemory.demands.spawn}/${motivationMemory.spawnAllocated}` , debug);
				}
			});
		} ,

		motivateRound2: function (sortedMotivations , room)
		{
			let debug = false;
			let roomName = room.name;
			let unAssignedCreeps = creepManager.getRoomUnassignedCreeps(roomName);
			_.forEach(unAssignedCreeps , (creep) =>
			{
				lib.log(`${roomLink(roomName)}: ${creep.name}` , debug);

				let maxCreeps = 1;
				this.findCreepJob(roomName , sortedMotivations , creep , maxCreeps);
			});
		} ,

		findCreepJob: function (roomName , sortedMotivations , creep)
		{
			let debug = false;
			let assigned = false;
			let isDemand = true;
			let tryCount = 1;
			let maxxed = false;
			let maxTrys = 20;

			if (roomName !== creep.memory.motive.room)
			{
				console.lob(`!!!!!> Trying to find a creep job in wrong room: ${creep.name} assign room: ${roomName} motive room: ${creep.motive.room} creep room: ${creep.room.name}`);
			}

			while (isDemand && !assigned && maxxed === false)
			{
				// reset this value, it needs to be set true in the loop to proceed to the next loop
				isDemand = false;
				// loop over motivations to look for an open spot
				_.forEach(sortedMotivations , (motivationMemory) =>
				{
					if (!assigned && motivationMemory.active && _.some(global[motivationMemory.name].getAssignableUnitNames() , (unitName) => unitName === creep.memory.unit))
					{
						let motiveUnits = creepManager.countRoomMotivationUnits(roomName , motivationMemory.name , creep.memory.unit);
						let demandedUnits = lib.nullProtect(motivationMemory.demands.units[creep.memory.unit] , 0);
						if (!assigned && motiveUnits < tryCount && motiveUnits < demandedUnits)
						{
							// read up needs sorted by priority
							let needs = _.sortByOrder(motivationMemory.needs , ['priority'] , ['desc']);
							_.forEach(needs , (need) =>
							{
								if (!assigned && !lib.isNull(need.demands))
								{
									let needUnits = creepManager.countRoomMotivationNeedUnits(roomName , motivationMemory.name , need.name , creep.memory.unit);
									let demandedNeedUnits = lib.nullProtect(need.demands[creep.memory.unit] , 0);
									if (needUnits < tryCount && needUnits < demandedNeedUnits)
									{
										creep.assignMotive(roomName , motivationMemory.name , need.name);
										assigned = true;
									}
								}
							});
						}

						// if there is still demand mark it so
						motiveUnits = creepManager.countRoomMotivationUnits(roomName , motivationMemory.name , creep.memory.unit);
						demandedUnits = lib.nullProtect(motivationMemory.demands.units[creep.memory.unit] , 0);
						if (motiveUnits < demandedUnits)
						{
							isDemand = true;
						}

						lib.log(`\t${creep.name} : ${motivationMemory.name} max: ${tryCount} assigned/demanded: ${motiveUnits}/${demandedUnits}` , debug);
					}
				});
				lib.log(`Assigned: ${assigned} isDemand: ${isDemand}` , debug);
				tryCount++;
				if (tryCount > maxTrys)
				{
					console.log("WHOA! trycount: " + tryCount);
					maxxed = true;
				}
			}

			// no assignment found try to force assign
			if (!assigned)
			{
				lib.log(`\t${creep.name} Room: ${roomLink(creep.room.name)}: No assignment found, trying force assign!` , debug);
				switch (creep.memory.unit)
				{
					case "hauler":
						if (roomManager.getIsMine(creep.memory.motive.room))
						{
							creep.assignMotive(creep.memory.motive.room , "motivationSupplySpawn" , "supplyExtenders." + creep.memory.motive.room);
							assigned = true;
						}
						break;
					case "worker":
						if (roomManager.getIsMine(creep.memory.motive.room))
						{
							creep.assignMotive(creep.memory.motive.room , "motivationSupplyController" , "supplyController." + creep.memory.motive.room);
							assigned = true;
						}
						break;
				}
			}

			if (!assigned)
			{
				lib.log(`\t${creep.name} Room: ${roomLink(creep.room.name)}: No assignment found!` , debug);
				creep.say("No JOB!");
				if (creep.room.name !== creep.memory.homeRoom)
					creep.deassignMotive(creep.memory.homeRoom);
			}

			// return true if the creep was assigned
			return assigned;
		}
	};