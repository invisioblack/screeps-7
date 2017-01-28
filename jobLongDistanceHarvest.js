//-------------------------------------------------------------------------
// jobLongDistanceHarvest
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
let Job = require("Job.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let JobLongDistanceHarvest = function ()
{
	Job.call(this);
	this.name = "jobLongDistanceHarvest";
};

JobLongDistanceHarvest.prototype = Object.create(Job.prototype);
JobLongDistanceHarvest.prototype.constructor = JobLongDistanceHarvest;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobLongDistanceHarvest.prototype.work = function (creep)
{
	let need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	let homeRoom = Game.rooms[creep.memory.homeRoom];
	let assigned = false;

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	_.forEach(homeRoom.memory.longDistanceHarvestTargets , (rN) =>
	{
		if (creep.memory.unit === "ldharvester" && !lib.isNull(Memory.rooms[rN]) && !lib.isNull(Memory.rooms[rN].motivations) && !lib.isNull(Memory.rooms[rN].motivations["motivationHarvestSource"]))
		{
			if (Memory.rooms[rN].motivations["motivationHarvestSource"].active)
			{
				if (Memory.rooms[rN].motivations["motivationHarvestSource"].active)
				{
					if (!assigned)
					{
						let roomMemory = Memory.rooms[rN];
						let numSources = roomMemory.cache.sources.length;
						let numHarvesters = creepManager.countRoomUnits(rN , "ldharvester");

						if (numSources > numHarvesters)
						{
							creep.deassignMotive(rN);
							assigned = true;
						}
					}
				}
			}
		}
		else if (creep.memory.unit === "worker" && !lib.isNull(Memory.rooms[rN]) && !lib.isNull(Memory.rooms[rN].motivations) && !lib.isNull(Memory.rooms[rN].motivations["motivationMaintainInfrastructure"]))
		{
			if (Memory.rooms[rN].motivations["motivationMaintainInfrastructure"].active)
			{

				if (!assigned)
				{
					let roomMemory = Memory.rooms[rN];
					let numWorkers = creepManager.countRoomUnits(rN , "worker");
					let workerDemand = roomMemory.demands["worker"];

					//console.log(`creep: ${creep.name} room: ${rN} num workers: ${numWorkers}/${workerDemand}`);
					if (numWorkers < workerDemand)
					{
						creep.deassignMotive(rN);
						assigned = true;
					}
				}
			}
		}
	});
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobLongDistanceHarvest();