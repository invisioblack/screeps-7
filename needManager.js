//------------------------------------------------------------------------------
// needManager
// The need manager is responsible for assigning and reassigning needs to the
// resources they need to be fullfilled. In most cases this means assigning a
// creep to fulfill the task, but in some cases it will be things like asking 
// the spawn to build another unit.
//------------------------------------------------------------------------------
"use strict";

module.exports =
	{
		//--------------------------------------------------------------------------
		// Declarations
		//--------------------------------------------------------------------------

		//--------------------------------------------------------------------------
		// top level functions
		//--------------------------------------------------------------------------
		"fulfillNeeds": function ()
		{
			let debug = false;
			for (let creepName in Game.creeps)
			{
				// @type {Creep}
				let creep = Game.creeps[creepName];

				if (creep.memory.motive.room === creep.room.name && creep.memory.motive.motivation !== "" && creep.memory.motive.need !== "")
				{
					lib.log(`Creep executing need: ${creep.name}: room: ${creep.room.name} motive room:${creep.memory.motive.room} ${creep.memory.motive.motivation}: ${creep.memory.motive.need}`, debug);

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
					else if (need.type === "needTransferEnergy")
					{
						lib.log("Creep: " + creep.name + " Working needTransferEnergy" , debug);
						jobTransfer.work(creep);
					}
					else if (need.type === "needBuild")
					{
						lib.log("Creep: " + creep.name + " Working needBuild" , debug);
						jobBuild.work(creep);
					}
					else if (need.type === "needRepair")
					{
						lib.log("Creep: " + creep.name + " Working needRepair" , debug);
						jobRepair.work(creep);
					}
					else if (need.type === "needHarvestSource")
					{
						lib.log("Creep: " + creep.name + " Working needHarvestSource" , debug);
						jobHarvestSource.work(creep);
					}
					else if (need.type === "needHarvestMinerals")
					{
						lib.log("Creep: " + creep.name + " Working needHarvestMinerals" , debug);
						jobHarvestMinerals.work(creep);
					}
					else if (need.type === "needLongDistanceHarvest")
					{
						lib.log("Creep: " + creep.name + " Working needLongDistanceHarvest" , debug);
						jobLongDistanceHarvest.work(creep);
					}
					else if (need.type === "needGarrison")
					{
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

					}
					else if (need.type === "needHaulMinerals")
					{
						lib.log("Creep: " + creep.name + " Working needHaulMinerals" , debug);
						jobHaulMinerals.work(creep);
					}
					else if (need.type === "needHaulToStorage")
					{
						lib.log("Creep: " + creep.name + " Working needHaulToStorage" , debug);
						jobTransfer.work(creep);
					}
					else if (need.type === "needClaim")
					{
						lib.log("Creep: " + creep.name + " Working needClaim" , debug);
						jobClaim.work(creep);
					}
					else if (need.type === "needManualTactical")
					{
						lib.log("Creep: " + creep.name + " Working needManualTactical" , debug);
						jobManualTactical.work(creep);
					}
					else if (need.type === "needSupplyExtenders")
					{
						lib.log("Creep: " + creep.name + " Working needSupplyExtenders" , debug);
						jobSupplyExtenders.work(creep);
					}
					else if (need.type === "needLongDistancePickup")
					{
						lib.log("Creep: " + creep.name + " Working needLongDistancePickup" , debug);
						jobLongDistancePickup.work(creep);
					}
				}
			}
		}
	};