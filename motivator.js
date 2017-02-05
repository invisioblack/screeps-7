"use strict";

module.exports =
	{
		/**
		 * Initializes the motivator, this must be called before motivate().
		 */
		init: function ()
		{
			cpuManager.timerStart("\tMotivate init" , "motivate.init");

			// update the base room cache
			Room.updateRoomCache();

			// init motivations in each room we control
			_.forEach(Game.rooms , (room , roomName) =>
			{
				// ini the room
				room.init();

				// init motivations in memory
				if (lib.isNull(room.memory.motivations))
				{
					room.memory.motivations = {};
				}

				/*******************************************************************************************************
				 * CORE
				 */
				cpuManager.timerStart(`\t  Motive Init ${roomName}` , `motivate.r1.mi.${roomName}`);

				// supply ----------------------------------------------------------------------------------------------
				if (room.isMine)
				{
					motivationSupply.init(room.name);
					room.memory.motivations[motivationSupply.name].priority = C.PRIORITY_5;
				}
				else if (motivationSupply.isInit(room.name))
				{
					motivationSupply.deInit(room.name);
				}

				/*
				 // harvestSource ---------------------------------------------------------------------------------------
				 if (room.isMine || room.isLongDistanceHarvestTarget)
				 {
				 motivationHarvestSource.init(room.name);
				 room.memory.motivations[motivationHarvestSource.name].priority = C.PRIORITY_1;
				 }
				 else if (motivationHarvestSource.isInit(room.name))
				 {
				 motivationHarvestSource.deInit(room.name);
				 }

				 // haulToStorage ---------------------------------------------------------------------------------------
				 if (room.isMine || room.isLongDistanceHarvestTarget)
				 {
				 motivationHaulToStorage.init(room.name);
				 room.memory.motivations[motivationHaulToStorage.name].priority = C.PRIORITY_2;
				 }
				 else if (motivationHaulToStorage.isInit(room.name))
				 {
				 motivationHaulToStorage.deInit(room.name);
				 }

				 // supplySpawn -----------------------------------------------------------------------------------------
				 if (room.isMine)
				 {
				 motivationSupplySpawn.init(room.name);
				 room.memory.motivations[motivationSupplySpawn.name].priority = C.PRIORITY_3;
				 }
				 else if (motivationSupplySpawn.isInit(room.name))
				 {
				 motivationSupplySpawn.deInit(room.name);
				 }

				 // supplyController ------------------------------------------------------------------------------------
				 if (room.isMine && room.memory.mode === C.ROOM_MODE_NORMAL || room.memory.mode === C.ROOM_MODE_WORKER_PANIC)
				 {
				 motivationSupplyController.init(room.name);
				 room.memory.motivations[motivationSupplyController.name].priority = C.PRIORITY_4;
				 }
				 else if (room.isMine && room.memory.mode === C.ROOM_MODE_SETTLE)
				 {
				 if (room.controller.ticksToDowngrade < 1000)
				 {
				 motivationSupplyController.init(room.name);
				 room.memory.motivations[motivationSupplyController.name].priority = C.PRIORITY_2;
				 } else if (motivationSupplyController.isInit(room.name))
				 {
				 motivationSupplyController.deInit(room.name);
				 }
				 }
				 else if (motivationSupplyController.isInit(room.name))
				 {
				 motivationSupplyController.deInit(room.name);
				 }

				 // longDistanceHarvest ---------------------------------------------------------------------------------
				 if (room.isMine && room.memory.mode === C.ROOM_MODE_NORMAL)
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
				 if ((room.isMine && room.memory.mode === C.ROOM_MODE_NORMAL) || isClaimed)
				 {
				 motivationClaimRoom.init(room.name);
				 room.memory.motivations[motivationClaimRoom.name].priority = C.PRIORITY_6;
				 }
				 else if (motivationClaimRoom.isInit(room.name))
				 {
				 motivationClaimRoom.deInit(room.name);
				 }

				 // maintainInfrastructure ------------------------------------------------------------------------------
				 if (room.isMine || room.isLongDistanceHarvestTarget)
				 {
				 motivationMaintainInfrastructure.init(room.name);
				 room.memory.motivations[motivationMaintainInfrastructure.name].priority = C.PRIORITY_7;
				 }
				 else if (motivationMaintainInfrastructure.isInit(room.name))
				 {
				 motivationMaintainInfrastructure.deInit(room.name);
				 }

				 // harvestMinerals -------------------------------------------------------------------------------------
				 if (room.isMine && room.memory.cache.structures[STRUCTURE_EXTRACTOR].length > 0)
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
				 */
				/*******************************************************************************************************
				 * COMBAT
				 */
				/*
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

				 if (Room.getIsMine(roomName) && _.some(Memory.scoutTargets , {sourceRoom: roomName}))
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
				 */
				cpuManager.timerStop(`motivate.r1.mi.${roomName}` , config.cpuInitDetailDebug);
			});

			/***************************************************************************************************************
			 * update unloaded rooms
			 */

			cpuManager.timerStart(`\t  Unloaded Rooms` , `motivate.r1.unloaded`);
			_.forEach(Memory.rooms , (v , k) =>
			{
				if (lib.isNull(Game.rooms[k]))
				{
					Room.updateUnitCache(k);
					Room.updateUnitMotiveCache(k);
				}
			});
			cpuManager.timerStop(`motivate.r1.unloaded` , config.cpuInitDetailDebug);
			cpuManager.timerStop("motivate.init" , config.cpuInitDebug , 7 , 10);
		} ,

		/*******************************************************************************************************************
		 * Main motivator function, should be called first from main
		 */
		motivate: function ()
		{
			cpuManager.timerStart("motivate" , "motivate");

			// motivate in each room we control ----------------------------------------------------------------------------
			cpuManager.timerStart(`\tRoom Total` , "motivate.roomTotal");
			_.forEach(Game.rooms , (room , roomName) =>
			{
				cpuManager.timerStart(`\tRoom: ${roomLink(roomName)}` , `motivate.room.${roomName}`);

				// declarations ----------------------------------------------------------------------------------------
				let sortedMotivations = _.sortByOrder(room.memory.motivations , ['priority'] , ['desc']);

				if (room.isMine)
				{
					// motivate defense towers
					room.motivateTowers();
					// safeMode failsafe
					room.safeModeFailsafe();
					// links
					room.motivateLinks();
				}

				this.motivateRound1(sortedMotivations , room);
				this.motivateRound2(sortedMotivations , room);

				cpuManager.timerStop(`motivate.room.${roomName}` , config.cpuRoomDetailDebug , 8 , 10);
			});
			cpuManager.timerStop("motivate.roomTotal" , config.cpuRoomDebug , 10 , 15);

			// fulfill needs -------------------------------------------------------------------------------------------
			this.fulfillNeeds();
			// lost creeps ---------------------------------------------------------------------------------------------
			this.handleLostCreeps();

			cpuManager.timerStop("motivate" , config.cpuMotivateDebug , 30 , 35);
		} ,

		/**
		 * first round motivation processing--------------------------------------------------------------------
		 * set up demands, active and spawning
		 * @param sortedMotivations
		 * @param room {Room}
		 */
		motivateRound1: function (sortedMotivations , room)
		{
			cpuManager.timerStart(`\t  Motivate R1` , `motivate.r1.${room.name}`);
			let debug = false;
			let roomName = room.name;
			let isSpawnAllocated = false;

			_.forEach(sortedMotivations , (motivationMemory) =>
			{
				//cpuManager.timerStart(`\tMotivate r1 Motive: ${roomName} ${motivationMemory.name}` , `motivate.motivateRound1.${motivationMemory.name}`);
				// is motivation active?
				// decide which motivations should be active -------------------------------------------------------
				global[motivationMemory.name].updateActive(roomName);

				if (motivationMemory.active)
				{
					// update needs ------------------------------------------------------------------------------------
					global[motivationMemory.name].updateNeeds(roomName);

					// set up demands ----------------------------------------------------------------------------------
					global[motivationMemory.name].getDemands(roomName);

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

					// spawn units if allocated spawn ------------------------------------------------------------------
					if (motivationMemory.spawnAllocated && room.isMine)
					{
						let isSpawning = false;
						_.forEach(Room.getSpawns(roomName) , spawn =>
						{
							if (!spawn.spawning && !isSpawning)
							{
								let unitName = global[motivationMemory.name].getDesiredSpawnUnit(roomName, global[motivationMemory.name].getDemands(roomName).units);
								if (spawn.spawnUnit(unitName))
								{
									isSpawning = true;
								}
							}
						});
					}

					// debug output
					lib.log(`${roomLink(roomName)}: motivate.r1: ${motivationMemory.name}\tActive: ${motivationMemory.active}\tSpawn demand/allocated:  ${motivationMemory.demands.spawn}/${motivationMemory.spawnAllocated}` , debug);
				}
				//cpuManager.timerStop(`motivate.motivateRound1.${motivationMemory.name}` , true , 0.2 , 0.5);
			});
			cpuManager.timerStop(`motivate.r1.${roomName}` , config.cpuMotivateDetailDebug);
		} ,

		/**
		 *
		 * @param sortedMotivations
		 * @param room
		 */
		motivateRound2: function (sortedMotivations , room)
		{
			cpuManager.timerStart(`\t  Motivate R2` , `motivate.r2.${room.name}`);
			let debug = true;
			let roomName = room.name;
			let unAssignedCreeps = Room.getUnassignedCreeps(roomName);

			_.forEach(unAssignedCreeps , (creep) =>
			{
				lib.log(`${roomLink(roomName)}: ${creep.name}` , debug);

				let maxCreeps = 1;
				this.findCreepJob(roomName , sortedMotivations , creep , maxCreeps);
			});
			cpuManager.timerStop(`motivate.r2.${roomName}` , config.cpuMotivateDetailDebug);
		} ,

		/**
		 *
		 * @param roomName
		 * @param sortedMotivations
		 * @param creep
		 * @returns {boolean}
		 */
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

			lib.log(`findCreepJob: ${roomName} creep: ${creep.name}`, debug);
			lib.log(`while.start isDemand: ${isDemand} assigned: ${assigned} maxxed ${maxxed}`, debug);
			while (isDemand && !assigned && maxxed === false)
			{

				// reset this value, it needs to be set true in the loop to proceed to the next loop
				isDemand = false;
				// loop over motivations to look for an open spot
				lib.log(`forEach.start sortedMotivations: ${sortedMotivations.length}`, debug);
				_.forEach(sortedMotivations , (motivationMemory) =>
				{
					let someUnits = _.some(global[motivationMemory.name].getAssignableUnitNames() , (unitName) => unitName === creep.memory.unit);
					lib.log(`b4 if1 assigned: ${assigned} active: ${motivationMemory.active} someUnits: ${someUnits}`, debug);
					if (!assigned && motivationMemory.active && someUnits)
					{
						// read up needs sorted by priority
						let motiveUnits, demandedUnits;
						let needs = _.sortByOrder(motivationMemory.needs , ['priority'] , ['desc']);
						lib.log(`need forEach: ${_.size(needs)}`, debug);
						_.forEach(needs , (need) =>
						{
							lib.log(`b4 need if1: assigned ${assigned} `, debug);
							if (!assigned)
							{
								let needUnits = Room.countMotivationNeedUnits(roomName , motivationMemory.name , need.name , creep.memory.unit);
								let demandedNeedUnits = lib.nullProtect(need.demands[creep.memory.unit] , 0);
								lib.log(`b4 need if2: needUnits ${needUnits} tryCount ${tryCount} demandedNeedUnits ${demandedNeedUnits}`, debug);
								if (needUnits < tryCount && needUnits < demandedNeedUnits)
								{
									creep.assignMotive(roomName , motivationMemory.name , need.name);
									lib.log(`Assigned: roomName ${roomName} motive: ${motivationMemory.name} ${need.name}`, debug);
									assigned = true;
								}
							}
						});

						// if there is still demand mark it so
						motiveUnits = Room.countMotivationUnits(roomName , motivationMemory.name , creep.memory.unit);
						demandedUnits = lib.nullProtect(motivationMemory.demands.units[creep.memory.unit] , 0);
						lib.log(`b4 isDemand if: motiveUnits ${motiveUnits} demandedUnits ${demandedUnits}`, debug);
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
						if (Room.getIsMine(creep.memory.motive.room))
						{
							creep.assignMotive(creep.memory.motive.room , "motivationSupply" , "supplyExtenders." + creep.memory.motive.room);
							lib.log(`Assigned: roomName ${creep.memory.motive.room} motive: ${creep.memory.motive.motivation} ${creep.memory.motive.need}`, debug);
							assigned = true;
						}
						break;
					case "worker":
						if (Room.getIsMine(creep.memory.motive.room) && creep.room.roomMode === C.ROOM_MODE_NORMAL)
						{
							creep.assignMotive(creep.memory.motive.room , "motivationSupply" , "supplyController." + creep.memory.motive.room);
							lib.log(`Assigned: roomName ${creep.memory.motive.room} motive: ${creep.memory.motive.motivation} ${creep.memory.motive.need}`, debug);
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
				{
					creep.deassignMotive(creep.memory.homeRoom);
				}
			}

			// return true if the creep was assigned
			return assigned;
		} ,

		/**
		 *
		 */
		fulfillNeeds: function ()
		{
			cpuManager.timerStart("\tFulfill Needs" , "motivate.fulfillNeeds");
			let debug = false;
			let creeps = _.filter(Game.creeps , creep => creep.memory.motive.room === creep.room.name && creep.memory.motive.motivation !== "" && creep.memory.motive.need !== "");
			_.forEach(creeps , creep =>
			{
				lib.log(`Creep executing need: ${creep.name}: room: ${creep.room.name} motive room:${creep.memory.motive.room} ${creep.memory.motive.motivation}: ${creep.memory.motive.need}` , debug);

				let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];

				lib.log("Creep: " + creep.name + " m: " + creep.memory.motive.motivation + " n: " + creep.memory.motive.need , debug);

				// deassign motive if we can't find the need
				if (lib.isNull(need))
				{
					creep.deassignMotive();
				}
				else if (lib.isNull(need.type))
				{
					creep.deassignMotive();
				}
				else
				{

					switch (need.type)
					{
						// motivationSupply
						case "needSupplyController":
						case "needSupplySpawn":
						case "needSupplyTowers":
							jobTransferEnergy.work(creep);
							break;
						case "needSupplyExtenders":
							jobSupplyExtenders.work(creep);
							break;
						/*
						case "needBuild":
							lib.log("Creep: " + creep.name + " Working needBuild" , debug);
							jobBuild.work(creep);
							break;
						case "needRepair":
							lib.log("Creep: " + creep.name + " Working needRepair" , debug);
							jobRepair.work(creep);
							break;
						case "needHarvestSource":
							lib.log("Creep: " + creep.name + " Working needHarvestSource" , debug);
							jobHarvestSource.work(creep);
							break;
						case   "needHarvestMinerals":
							lib.log("Creep: " + creep.name + " Working needHarvestMinerals" , debug);
							jobHarvestMinerals.work(creep);
							break;
						case "needLongDistanceHarvest":
							lib.log("Creep: " + creep.name + " Working needLongDistanceHarvest" , debug);
							jobLongDistanceHarvest.work(creep);
							break;
						case "needGarrison":
							lib.log("Creep: " + creep.name + " Working needGarrison" , debug);
							switch (creep.memory.unit)
							{
								case "guard":
									jobGuard.work(creep);
									break;
								case "rangedGuard":
									jobRangedGuard.work(creep);
									break;
								case "heal":
									jobHeal.work(creep);
									break;
							}
							break;
						case "needHaulMinerals":
							lib.log("Creep: " + creep.name + " Working needHaulMinerals" , debug);
							jobHaulMinerals.work(creep);
							break;
						case "needHaulToStorage":
							lib.log("Creep: " + creep.name + " Working needHaulToStorage" , debug);
							jobTransfer.work(creep);
							break;
						case "needClaim":
							lib.log("Creep: " + creep.name + " Working needClaim" , debug);
							jobClaim.work(creep);
							break;
						case "needManualTactical":
							lib.log("Creep: " + creep.name + " Working needManualTactical" , debug);
							jobManualTactical.work(creep);
							break;
						case "needLongDistancePickup":
							lib.log("Creep: " + creep.name + " Working needLongDistancePickup" , debug);
							jobLongDistancePickup.work(creep);
							break;
						case "needScout":
							lib.log("Creep: " + creep.name + " Working needScout" , debug);
							jobScout.work(creep);
							break;
						 */
					}

					lib.log(`Creep: ${creep.name} Working ${need.type}`, debug);
					// creep edge protection
					creep.getOffEdge();
				}
			});
			cpuManager.timerStop("motivate.fulfillNeeds" , config.cpuNeedsDebug , 10 , 15);
		} ,

		/**
		 *
		 */
		handleLostCreeps: function ()
		{
			cpuManager.timerStart("\tHandle Lost" , "handleLostCreeps");
			let debug = false;
			let lostCreeps = _.filter(Game.creeps , creep => creep.room.name !== creep.memory.motive.room);

			//console.log("Lost creeps: " + lostCreeps.length);
			lostCreeps.forEach(function (creep)
			{
				let position = new RoomPosition(25 , 25 , creep.memory.motive.room);
				cpuManager.timerStart("\tLost Move" , "handleLostCreeps.move");
				let moveResult = creep.travelTo(position);
				cpuManager.timerStop("handleLostCreeps.move" , config.cpuHandleLostDebug , 1 , 5);
				creep.say("Leave!");
				lib.log(`LEAVE creep: ${creep.name} room: ${creep.room.name} dest: ${creep.memory.motive.room} move: ${moveResult}` , debug);
			} , this);
			cpuManager.timerStop("handleLostCreeps" , config.cpuHandleLostDebug , 3 , 5);
		}
	};