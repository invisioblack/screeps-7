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
	let target = Game.getObjectById(need.targetId);
	let carry = _.sum(creep.carry);
	let homeRoom = Game.rooms[creep.memory.homeRoom];
	let unitName = "ldharvester";
	let assigned = false;

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	_.forEach(homeRoom.memory.longDistanceHarvestTargets, (rN) => {
		if (Memory.rooms[rn].motivations["motivationHarvestSource"].active) {
			if (!assigned) {

				let roomMemory = Memory.rooms[rN];
				let numSources = roomMemory.cache.sources.length;
				let numHarvesters = _.has(global, "cache.rooms." + rN + ".units." + unitName) ? global.cache.rooms[rN].units[unitName].length : 0;

				//console.log(`${numSources} ${numHarvesters}`);
				if (numSources > numHarvesters) {
					creep.deassignMotive(rN);
					assigned = true;
				}
			}
		}
	});

};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobLongDistanceHarvest();