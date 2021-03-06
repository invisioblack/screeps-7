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

				// harvestSource ---------------------------------------------------------------------------------------
				if ((room.isMine && room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER) || room.isRHarvestTarget)
				{
					motivationHarvest.init(room.name);
					if (room.roomMode >= C.ROOM_MODE_NORMAL)
						room.memory.motivations[motivationHarvest.name].priority = C.PRIORITY_1;
					else
						room.memory.motivations[motivationHarvest.name].priority = C.PRIORITY_2;
				}
				else if (motivationHarvest.isInit(room.name))
				{
					motivationHarvest.deInit(room.name);
				}


				// haul ------------------------------------------------------------------------------------------------
				if (room.isMine || room.isRHarvestTarget)
				{
					motivationHaul.init(room.name);
					room.memory.motivations[motivationHaul.name].priority = C.PRIORITY_4;
				}
				else if (motivationHaul.isInit(room.name))
				{
					motivationHaul.deInit(room.name);
				}


				// supply ----------------------------------------------------------------------------------------------
				if (room.isMine)
				{
					motivationSupply.init(room.name);
					if (room.roomMode >= C.ROOM_MODE_NORMAL)
						room.memory.motivations[motivationSupply.name].priority = C.PRIORITY_3;
					else
						room.memory.motivations[motivationSupply.name].priority = C.PRIORITY_1;
				}
				else if (motivationSupply.isInit(room.name))
				{
					motivationSupply.deInit(room.name);
				}

				// maintainInfrastructure ------------------------------------------------------------------------------
				if (room.isMine || room.isRHarvestTarget)
				{
					motivationMaintain.init(room.name);
					room.memory.motivations[motivationMaintain.name].priority = C.PRIORITY_7;
				}
				else if (motivationMaintain.isInit(room.name))
				{
					motivationMaintain.deInit(room.name);
				}

				// scout -----------------------------------------------------------------------------------------------
				if (lib.isNull(Memory.scoutTargets))
					Memory.scoutTargets = [];

				if (Room.getIsMine(roomName) && room.roomMode >= C.ROOM_MODE_NORMAL && _.some(Memory.scoutTargets , {sourceRoom: roomName}))
				{
					motivationScout.init(room.name);
					room.memory.motivations[motivationScout.name].priority = C.PRIORITY_1;
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

				// claimRoom -------------------------------------------------------------------------------------------
				//console.log(`Claim Init Room:${room.name} isMine: ${room.isMine} roomMode: ${room.roomMode} claimSpawn: ${room.claimSpawn} getClaim(): ${Room.getClaim(this.name)}`);
				if (room.isMine && room.roomMode >= C.ROOM_MODE_NORMAL && room.claimSpawn)
				{
					motivationClaim.init(room.name);
					room.memory.motivations[motivationClaim.name].priority = C.PRIORITY_6;
				}
				else if (!room.isMine && Room.getClaim(room.name) !== C.CLAIM_NONE)
				{
					motivationClaim.init(room.name);
					room.memory.motivations[motivationClaim.name].priority = C.PRIORITY_4;
				}
				else if (motivationClaim.isInit(room.name))
				{
					motivationClaim.deInit(room.name);
				}

				/*******************************************************************************************************
				 * COMBAT
				 */
				// defense ---------------------------------------------------------------------------------------------
				motivationDefense.init(room.name);
				room.memory.motivations[motivationDefense.name].priority = C.PRIORITY_2;

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
			let debug = false;
			let roomName = room.name;
			let unAssignedCreeps = Room.getUnassignedCreeps(roomName);

			_.forEach(unAssignedCreeps , (creep) =>
			{
				lib.log(`Motivate.R2 Unassigned creep: ${roomLink(roomName)}: ${creep.name}` , debug);

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
				lib.log(`\tforEach.start sortedMotivations: ${sortedMotivations.length}`, debug);
				_.forEach(sortedMotivations , (motivationMemory) =>
				{
					let someUnits = _.some(global[motivationMemory.name].getAssignableUnitNames() , (unitName) => unitName === creep.memory.unit);
					lib.log(`\t\tb4 if1 motive: ${motivationMemory.name} assigned: ${assigned} active: ${motivationMemory.active} someUnits: ${someUnits}`, debug);
					if (!assigned && motivationMemory.active && someUnits)
					{
						// read up needs sorted by priority
						let motiveUnits, demandedUnits;
						let needs = _.sortByOrder(motivationMemory.needs , ['priority'] , ['desc']);
						lib.log(`\t\t\tneed forEach: #needs ${_.size(needs)}`, debug);
						_.forEach(needs , (need) =>
						{
							lib.log(`\t\t\t\tb4 need if1: need: ${need.name} assigned ${assigned} `, debug);
							if (!assigned)
							{
								let needUnits = Room.countMotivationNeedUnits(roomName , motivationMemory.name , need.name , creep.memory.unit);
								let demandedNeedUnits = global[need.type].getUnitDemands(roomName, need, motivationMemory.name)[creep.memory.unit];
								lib.log(`\t\t\t\t\tb4 need if2: needUnits ${needUnits} tryCount ${tryCount} demandedNeedUnits ${demandedNeedUnits}`, debug);
								if (needUnits < tryCount && needUnits < demandedNeedUnits)
								{
									creep.assignMotive(roomName , motivationMemory.name , need.name);
									lib.log(`\t\t\t\t\tAssigned: roomName ${roomName} motive: ${motivationMemory.name} ${need.name}`, debug);
									assigned = true;
								}
							}
						});

						// if there is still demand mark it so
						motiveUnits = Room.countMotivationUnits(roomName , motivationMemory.name , creep.memory.unit);
						demandedUnits = lib.nullProtect(motivationMemory.demands.units[creep.memory.unit] , 0);
						lib.log(`\t\t\tb4 isDemand if: motiveUnits ${motiveUnits} demandedUnits ${demandedUnits}`, debug);
						if (motiveUnits < demandedUnits)
						{
							isDemand = true;
						}

						lib.log(`\t\t\t${creep.name} : ${motivationMemory.name} max: ${tryCount} assigned/demanded: ${motiveUnits}/${demandedUnits}` , debug);
					}
				});
				lib.log(`\tAssigned: ${assigned} isDemand: ${isDemand}` , debug);
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

				if (lib.isNull(creep.room.memory.motivations[creep.memory.motive.motivation]))
				{
					creep.deassignMotive();
				}
				else
				{
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
							// motivationMaintain
							case "needBuild":
								jobBuild.work(creep);
								break;
							case "needRepair":
								jobRepair.work(creep);
								break;
							case "needRMaintain":
								lib.log("Creep: " + creep.name + " Working needRMaintain" , debug);
								jobRemote.work(creep);
								break;
							// motivationHarvest
							case "needHarvestSource":
								lib.log("Creep: " + creep.name + " Working needHarvestSource" , debug);
								jobHarvestSource.work(creep);
								break;
							case "needHarvestMinerals":
								lib.log("Creep: " + creep.name + " Working needHarvestMinerals" , debug);
								jobHarvestMinerals.work(creep);
								break;
							case "needRHarvest":
								lib.log("Creep: " + creep.name + " Working needRHarvest" , debug);
								jobRemote.work(creep);
								break;
							// motivationHaul
							case "needHaul":
								lib.log("Creep: " + creep.name + " Working needHaul" , debug);
								jobHaul.work(creep);
								break;
							case "needRHaul":
								lib.log("Creep: " + creep.name + " Working needRHaul" , debug);
								jobRemote.work(creep);
								break;
							case "needDropoff":
								lib.log("Creep: " + creep.name + " Working needHaul" , debug);
								jobDropoff.work(creep);
								break;
							//motivationScout
							case "needScout":
								lib.log("Creep: " + creep.name + " Working needScout" , debug);
								jobScout.work(creep);
								break;

							// motivationClaim
							case "needClaim":
								lib.log("Creep: " + creep.name + " Working needClaim" , debug);
								jobClaim.work(creep);
								break;
							/*
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

							 case "needManualTactical":
							 lib.log("Creep: " + creep.name + " Working needManualTactical" , debug);
							 jobManualTactical.work(creep);
							 break;

							 */
						}

						lib.log(`Creep: ${creep.name} Working ${need.type}` , debug);
						// creep edge protection
						creep.getOffEdge();
					}
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
				let moveResult = creep.moveTo2(position);
				cpuManager.timerStop("handleLostCreeps.move" , config.cpuHandleLostDebug , 1 , 5);
				creep.say("Leave!");
				lib.log(`LEAVE creep: ${creep.name} room: ${creep.room.name} dest: ${creep.memory.motive.room} move: ${moveResult}` , debug);
			} , this);
			cpuManager.timerStop("handleLostCreeps" , config.cpuHandleLostDebug , 3 , 5);
		}
	};