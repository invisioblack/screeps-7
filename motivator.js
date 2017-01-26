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
		"init": function () {
			cpuManager.timerStart("motivate init", "motivate.init");
			// init motivations in each room we control
			_.forEach(Game.rooms, (room, roomName) => {
				room.init();
				room.initMemCache();
				room.updateEnergyPickupMode();

				// update defenses -----------------------------------------------------------------------------------------
				room.updateThreat();

				// init motivations in memory
				if (lib.isNull(room.memory.motivations)) {
					room.memory.motivations = {};
				}

				// init each motivation for this room
				motivationManualTactical.init(room.name);
				room.memory.motivations[motivationManualTactical.name].priority = C.PRIORITY_1;

				// should only be init in my room, or a ldh target
				if (room.getIsMine() || roomManager.getIsLongDistanceHarvestTarget(room.name)) {
					motivationHarvestSource.init(room.name);
					room.memory.motivations[motivationHarvestSource.name].priority = C.PRIORITY_1;
				} else if (motivationHarvestSource.isInit(room.name)) {
					motivationHarvestSource.deInit(room.name);
				}

				// should only be init in my room, or a ldh target
				if (room.getIsMine() || roomManager.getIsLongDistanceHarvestTarget(room.name)) {
					motivationHaulToStorage.init(room.name);
					room.memory.motivations[motivationHaulToStorage.name].priority = C.PRIORITY_2;
				} else if (motivationHaulToStorage.isInit(room.name)) {
					motivationHaulToStorage.deInit(room.name);
				}

				// only active in my rooms with towers
				if (room.getIsMine() && room.memory.cache.structures[STRUCTURE_TOWER].length > 0) {
					motivationSupplyTower.init(room.name);
					room.memory.motivations[motivationSupplyTower.name].priority = C.PRIORITY_4;
				} else if (motivationSupplyTower.isInit(room.name)) {
					motivationSupplyTower.deInit(room.name);
				}

				// TODO: this one should only be active in rooms with a claim
				motivationClaimRoom.init(room.name);
				room.memory.motivations[motivationClaimRoom.name].priority = C.PRIORITY_4;

				motivationGarrison.init(room.name);
				room.memory.motivations[motivationGarrison.name].priority = C.PRIORITY_2;

				// should only be init in my room
				if (room.getIsMine()) {
					motivationLongDistanceHarvest.init(room.name);
					room.memory.motivations[motivationLongDistanceHarvest.name].priority = C.PRIORITY_3;
				} else if (motivationLongDistanceHarvest.isInit(room.name)) {
					motivationLongDistanceHarvest.deInit(room.name);
				}


				// only in my rooms
				if (room.getIsMine()) {
					motivationSupplySpawn.init(room.name);
					room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_1;
				} else if (motivationSupplySpawn.isInit(room.name)) {
					motivationSupplySpawn.deInit(room.name);
				}

				// should only be init in my room, or a ldh target
				if (room.getIsMine() || roomManager.getIsLongDistanceHarvestTarget(room.name)) {
					motivationMaintainInfrastructure.init(room.name);
					room.memory.motivations[motivationMaintainInfrastructure.name].priority = C.PRIORITY_5;
				} else if (motivationMaintainInfrastructure.isInit(room.name)) {
					motivationMaintainInfrastructure.deInit(room.name);
				}

				// only in my rooms
				if (room.getIsMine()) {
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
				} else if (motivationSupplyController.isInit(room.name)) {
					motivationSupplyController.deInit(room.name);
				}

				// only in my room with extractor
				if (room.getIsMine() && room.memory.cache.structures[STRUCTURE_EXTRACTOR].length > 0) {
					let mineralContainer = Game.getObjectById(room.memory.mineralContainerId);
					let containerTotal = 0;

					motivationHarvestMinerals.init(room.name);
					motivationHaulMinerals.init(room.name);
					room.memory.motivations[motivationHarvestMinerals.name].priority = C.PRIORITY_6;
					room.memory.motivations[motivationHaulMinerals.name].priority = C.PRIORITY_6;

					if (!lib.isNull(mineralContainer)) {
						containerTotal = _.sum(mineralContainer.store);
					}
					if (containerTotal > 1000)
						room.memory.motivations[motivationHaulMinerals.name].priority = C.PRIORITY_1;
				} else if (motivationHarvestMinerals.isInit(room.name)) {
					motivationHarvestMinerals.deInit(room.name);
					motivationHaulMinerals.deInit(room.name);
				}
			});

			/***************************************************************************************************************
			 * update unloaded rooms
			 */
			_.forEach(Memory.rooms, (v, k) => {
				if (lib.isNull(Game.rooms[k])) {
					roomManager.updateUnitCache(k);
					roomManager.updateUnitMotiveCache(k);
				}
			});
			cpuManager.timerStop("motivate.init", config.cpuInitDebug, 1, 2);
		},

		/*******************************************************************************************************************
		 * Main motivator function, should be called first from main
		 */
		"motivate": function () {
			cpuManager.timerStart("motivate", "motivate");
			let debug = false;
			let room;
			let cpuUsed = 0;

			// motivate in each room we control ----------------------------------------------------------------------------
			for (let roomName in Game.rooms) {
				cpuManager.timerStart(`\tRoom: ${roomLink(roomName)}`, "motivate.room");

				// declarations ----------------------------------------------------------------------------------------
				let sortedMotivations;
				room = Game.rooms[roomName];

				// motivate defense towers -----------------------------------------------------------------------------
				// TODO: Separate out healing from killing on the turrets
				if (room.getIsMine()) {
					room.motivateTowers(roomName);
					// safeMode failsafe
					room.safeModeFailsafe(roomName);
				}

				// links ---------------------------------------------------------------------------------------------------
				room.motivateLinks();

				// -----------------------------------------------------------------------------------------------------
				// process motivations in order of priority ------------------------------------------------------------
				// get sorted motivations
				sortedMotivations = _.sortByOrder(room.memory.motivations, ['priority'], ['desc']);

				cpuManager.timerStart(`\t\tMotivate R1`, "motivate.r1");
				this.motivateRound1(sortedMotivations, room);
				cpuManager.timerStop("motivate.r1", config.cpuMotivateDebug);

				this.sendWorkersToLDHRooms(roomName);

				cpuManager.timerStart(`\t\tMotivate R2`, "motivate.r2");
				this.motivateRound2(sortedMotivations, room);
				cpuManager.timerStop("motivate.r2", config.cpuMotivateDebug);

/*
				// TODO: this needs to be implemented differently, this is just a hack
				// send off helpers for long distance harvest rooms
				this.sendWorkersToLDHRooms(roomName);


				// second and 3rd round motivation processing ----------------------------------------------------------
				// unit allocation and need processing
				countActiveMotivations = this.countActiveMotivations(roomName);
				lib.log("--: Active Motivations: " + countActiveMotivations, debug);

				// process round 2 and 3 for each unit type ------------------------------------------------------------
				cpuManager.timerStart(`\t\tMotivate R2&R3`, "motivate.r2");
				this.motivateRound2n3(roomName, sortedMotivations, demands, resources);
				cpuManager.timerStop("motivate.r2", config.cpuMotivateDebug);


				// motivation round 4 ----------------------------------------------------------------------------------
				cpuManager.timerStart(`\t\tManage Needs`, "motivate.r4");
				this.motivateRound4(sortedMotivations, room);
				cpuManager.timerStop("motivate.r4", config.cpuMotivateDebug);
*/
				cpuManager.timerStop("motivate.room", config.cpuRoomDebug, 8, 10);
			}

			// fulfill needs ---------------------------------------------------------------------------------------
			cpuManager.timerStart("\tFulfill Needs", "motivate.fulfillNeeds");
			needManager.fulfillNeeds();
			cpuManager.timerStop("motivate.fulfillNeeds", config.cpuNeedsDebug, 5, 10);

			cpuManager.timerStop("motivate", config.cpuMotivateDebug, 25, 40);
		},

		/**
		 * first round motivation processing--------------------------------------------------------------------
		 * set up demands, active and spawning
		 * @param sortedMotivations
		 * @param room {Room}
		 */
		motivateRound1: function (sortedMotivations, room) {
			let debug = false;
			let roomName = room.name;
			let isSpawnAllocated = false;


			_.forEach(sortedMotivations, (motivationMemory) =>
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
						_.forEach(Game.spawns, (spawn, spawnName) =>
						{
							if (spawn.room.name === roomName)
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
		},

		motivateRound2: function (sortedMotivations, room) {
			let debug = true;
			let roomName = room.name;
			let unAssignedCreeps = creepManager.getRoomUnassignedCreeps(roomName);
			_.forEach(unAssignedCreeps, (creep) => {
				lib.log(`${roomLink(roomName)}: ${creep.name}`, debug);

				let maxCreeps = 1, maxTrys = 5;
				let success = false;
				while (maxCreeps <= maxTrys && !success)
				{
					success = this.findCreepJob(roomName, sortedMotivations, creep, maxCreeps);
					maxCreeps++;
				}

			});
		},

		findCreepJob: function (roomName, sortedMotivations, creep, maxCreeps)
		{
			let debug = true;
			let assigned = false;
			_.forEach(sortedMotivations, (motivationMemory) =>
			{
				if (!assigned && motivationMemory.active)
				{
					let motivation = global[motivationMemory.name];
					if (_.some(motivation.getAssignableUnitNames() , (unit) =>
						{
							return creep.memory.unit === unit
						}))
					{
						let motiveUnits = creepManager.countRoomMotivationUnits(roomName , motivationMemory.name , creep.memory.unit);
						let demandedUnits = lib.nullProtect(motivationMemory.demands.units[creep.memory.unit] , 0);
						if (motiveUnits < maxCreeps && motiveUnits < demandedUnits)
						{
							console.log("Fine me a need!");
							// read up needs sorted by priority
							let needs = _.sortByOrder(motivationMemory.needs , ['priority'] , ['desc']);
							_.forEach(needs , (need) =>
							{
								if (!assigned)
								{
									let needUnits = creepManager.countRoomMotivationNeedUnits(roomName , motivationMemory.name, need.name , creep.memory.unit);
									let demandedNeedUnits = lib.nullProtect(need.demands[creep.memory.unit] , 0);
									if (needUnits < maxCreeps && needUnits < demandedNeedUnits)
									{
										console.log("Assign ME!");
										creep.assignMotive(roomName, motivationMemory.name , need.name);
										assigned = true;
									}
								}
							});
						}
						lib.log(`\t${creep.name} : ${motivationMemory.name} max: ${maxCreeps} assigned/demanded: ${motiveUnits}/${demandedUnits}` , debug);
					}
				}
			});

			// return true if the creep was assigned
			return assigned;
		},

		// helper functions ------------------------------------------------------------------------------------------------

		sendWorkersToLDHRooms: function (roomName) {
			let debug = false;
			let spawnRoom = Game.rooms[roomName];

			// don't do this in rooms I don't own
			if (!spawnRoom.getIsMine())
				return;

			let numWorkers = creepManager.countHomeRoomUnits(roomName, "worker");
			//_.has(global, "cache.rooms." + roomName + ".units.worker") ? global.cache.rooms[roomName].units["worker"].length : 0;
			let targets = lib.nullProtect(spawnRoom.memory.longDistanceHarvestTargets, []);
			lib.log(`Spawn Room: ${roomName} workers: ${numWorkers}`, debug);

			_.forEach(targets, (rN) => {
				if (!lib.isNull(Memory.rooms[rN]) && !lib.isNull(Memory.rooms[rN].motivations) && !lib.isNull(Memory.rooms[rN].motivations["motivationMaintainInfrastructure"]) && !lib.isNull(Memory.rooms[rN].motivations["motivationMaintainInfrastructure"].demands)) {
					let numWorkersRoom = creepManager.countHomeRoomUnits(rN, "worker");
					//_.has(global, "cache.rooms." + rN + ".units.worker") ? global.cache.rooms[rN].units["worker"].length : 0;
					let demandedWorkers = lib.nullProtect(Memory.rooms[rN].motivations["motivationMaintainInfrastructure"].demands.units["worker"], 0);

					lib.log(`Target Room: ${rN} workers: ${numWorkersRoom}/${demandedWorkers}`, debug);

					if (numWorkers >= config.medWorkers && numWorkersRoom < 1 && demandedWorkers > 1) {
						lib.log(`Trying to allocate for target Room: ${rN}`, debug);
						let creep = creepManager.findRoomUnassignedUnit(roomName, "worker");
						if (!lib.isNull(creep)) {
							lib.log(`Allocating ${creep.name} to target Room: ${rN}`, debug);
							creep.assignToRoom(rN);
							numWorkers--;
						}
					}
				}
			});
		}
	};