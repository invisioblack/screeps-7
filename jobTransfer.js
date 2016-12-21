//-------------------------------------------------------------------------
// jobHarvest
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require("lib");
//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------
var JOB_MODE_GETENERGY = 0;
var JOB_MODE_WORK = 1;

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports =
{
	//-------------------------------------------------------------------------

	"work": function (creep)
	{
		var need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
		var source = Game.getObjectById(need.sourceId);
		var target = Game.getObjectById(need.targetId);
		var carry = _.sum(creep.carry);
		
		//avoid hostiles
		if (creep.avoidHostile(creep))
		{
			return;
		}

		// set up mode memory
		if (lib.isNull(creep.memory.job))
		{
			creep.memory.job = {};
		}
		if (lib.isNull(creep.memory.job.mode))
		{
			creep.memory.job.mode = JOB_MODE_GETENERGY;
		}

		// manage job
		switch (creep.memory.job.mode)
		{
			case JOB_MODE_GETENERGY:
				if (carry == creep.carryCapacity)
				{
					creep.memory.job.mode = JOB_MODE_WORK;
				} else {
					//console.log("harvest:" + source);
					if (creep.harvest(source) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(source);
					}
				}
				break;
			case JOB_MODE_WORK:
				if (carry == 0)
				{
					creep.memory.job.mode = JOB_MODE_GETENERGY;
					creep.deassignMotive();
				} else {
					//console.log("return: " + target);
					var result = creep.transfer(target, RESOURCE_ENERGY);
					if (result == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(target);
					} else if (result == ERR_FULL) {
						//console.log("---- RESET");
						creep.deassignMotive();
					}
				}
				break;
		}
	}
};