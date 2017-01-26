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
	"manageNeeds": function (roomName, motivation, motivationMemory)
	{
		let debug = false;
		let room = Game.rooms[roomName];
		let needs;

		// create and update needs for motivation

		lib.log("ROOM: " + roomName + " needManager.manageNeeds: motivation.name: " + motivation.name, debug);

		// read up needs sorted by priority
		needs = _.sortByOrder(room.memory.motivations[motivation.name].needs , ['priority'], ['desc']);

		// first we need to figure out if we have any open allocations
		//cpuManager.timerStart(`need.unit Room: ${roomName} Motive: ${motivation.name}`, "manageNeeds.unit");
		_.forEach(units, (unit, unitName) =>
		{
			//console.log("unit: " + unitName);

			let assignedUnits = creepManager.countRoomMotivationUnits(roomName, motivation.name , unitName);
			let allocatedUnits = motivationMemory.allocatedUnits[unitName];

			// if we have open allocations, we need to find if there is a creep to assign
			let outOfCreeps = false;
			let hasDemand = true;
			//console.log("Preloop");
			let y = 0;
			while (!outOfCreeps && hasDemand && assignedUnits < allocatedUnits)
			{
				_.forEach(needs, (need) =>
				{
					lib.log(`Need: ${need.name}`, debug);

					// if there is a creep to assign, we need to assign it
					let unitDemands = lib.nullProtect(motivationMemory.needs[need.name].demands, {});
					let creepsDemanded = lib.nullProtect(unitDemands[unitName], 0);
					let creepsAssigned = creepManager.countRoomMotivationNeedUnits(roomName, motivation.name , need.name , unitName);
					let creep = creepManager.findRoomUnassignedUnit(roomName, unitName);

					if (creepsDemanded === 0)
						outOfCreeps = true;

					lib.log("unit: " + unitName + " outOfCreeps: " + outOfCreeps + " assignedUnits: " + assignedUnits + " allocatedUnits " + allocatedUnits, debug);
					lib.log("creepsAssigned: " + creepsAssigned + " creepsDemanded: " + creepsDemanded, debug);

					let x = 0;
					while (!lib.isNull(creep) && creepsAssigned < creepsDemanded && assignedUnits < allocatedUnits)
					{
						creep.assignMotive(roomName , motivation.name , need.name);

						// update for iteration
						creep = creepManager.findRoomUnassignedUnit(roomName, unitName);
						creepsAssigned++;
						assignedUnits++;
						allocatedUnits++;
						x++;
						lib.log(`WHOAH X: ${x}`, x > 10);
					}

					// you think you can move this up into the while above, but don't it causes problems on rare iterations
					if (lib.isNull(creep))
						outOfCreeps = true;
					if (creepsAssigned >= creepsDemanded)
						hasDemand = false;
				});
				y++;
				lib.log(`WHOAH Y: ${y}`, y > 10);
			}

			if (assignedUnits || allocatedUnits)
				lib.log("    " + motivation.name + ": Assigned/Allocated " + unitName + ": " + assignedUnits + "/" + allocatedUnits, debug);
		});
		//cpuManager.timerStop("manageNeeds.unit", config.cpuNeedsUnitDebug, 0.1, 0.2);
	},

	"fulfillNeeds": function ()
	{
		let debug = false;
		for (let creepName in Game.creeps)
		{
			// @type {Creep}
			let creep = Game.creeps[creepName];
			if (creep.memory.motive.room === creep.room.name && creep.memory.motive.motivation != "" && creep.memory.motive.need != "")
			{
				lib.log("Creep executing need: " + creep.name + " : " + creep.memory.motive.motivation + " : " + creep.memory.motive.need, debug);

				let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];

				lib.log("Creep: " + creep.name + " m: " + creep.memory.motive.motivation + " n: " + creep.memory.motive.need, debug);

				// deassign motive if we can't find the need
				if (lib.isNull(need))
					creep.deassignMotive();
				else if (lib.isNull(need.type))
					creep.deassignMotive();
				else if (need.type === "needTransferEnergy")
				{
					lib.log("Creep: " + creep.name + " Working needTransferEnergy", debug);
					jobTransfer.work(creep);
				}
				else if (need.type === "needBuild")
				{
					lib.log("Creep: " + creep.name + " Working needBuild", debug);
					jobBuild.work(creep);
				}
				else if (need.type === "needRepair")
				{
					lib.log("Creep: " + creep.name + " Working needRepair", debug);
					jobRepair.work(creep);
				}
				else if (need.type === "needHarvestSource")
				{
					lib.log("Creep: " + creep.name + " Working needHarvestSource", debug);
					jobHarvestSource.work(creep);
				}
				else if (need.type === "needHarvestMinerals")
				{
					lib.log("Creep: " + creep.name + " Working needHarvestMinerals", debug);
					jobHarvestMinerals.work(creep);
				}
				else if (need.type === "needLongDistanceHarvest")
				{
					lib.log("Creep: " + creep.name + " Working needLongDistanceHarvest", debug);
					jobLongDistanceHarvest.work(creep);
				}
				else if (need.type === "needGarrison")
				{
					lib.log("Creep: " + creep.name + " Working needGarrison", debug);
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
					lib.log("Creep: " + creep.name + " Working needHaulMinerals", debug);
					jobHaulMinerals.work(creep);
				}
				else if (need.type === "needHaulToStorage")
				{
					lib.log("Creep: " + creep.name + " Working needHaulToStorage", debug);
					jobTransfer.work(creep);
				}
				else if (need.type === "needClaim")
				{
					lib.log("Creep: " + creep.name + " Working needClaim", debug);
					jobClaim.work(creep);
				}
				else if (need.type === "needManualTactical")
				{
					lib.log("Creep: " + creep.name + " Working needManualTactical", debug);
					jobManualTactical.work(creep);
				}
				else if (need.type === "needSupplyExtenders")
				{
					lib.log("Creep: " + creep.name + " Working needSupplyExtenders", debug);
					jobSupplyExtenders.work(creep);
				}
				else if (need.type === "needLongDistancePickup")
				{
					lib.log("Creep: " + creep.name + " Working needLongDistancePickup", debug);
					jobLongDistancePickup.work(creep);
				}
			}
		}
	}
};