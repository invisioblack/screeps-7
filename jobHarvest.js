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
var HARVEST_MODE_HARVEST = 0;
var HARVEST_MODE_RETURN = 1;

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
		if (lib.isNull(creep.memory.job.harvestMode))
		{
			creep.memory.job.harvestMode = HARVEST_MODE_HARVEST;
		}

		// manage job
		switch (creep.memory.job.harvestMode)
		{
			case HARVEST_MODE_HARVEST:
				if (carry == creep.carryCapacity)
				{
					creep.memory.job.harvestMode = HARVEST_MODE_RETURN;
				} else {
					console.log("harvest:" + source);
					if (creep.harvest(source) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(source);
					}
				}
				break;
			case HARVEST_MODE_RETURN:
				if (carry == 0)
				{
					creep.memory.job.harvestMode = HARVEST_MODE_HARVEST;
				} else {
					console.log("return: " + target);
					var result = creep.transfer(target, RESOURCE_ENERGY);
					if (result == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(target);
					} else if (result == ERR_FULL) {
						console.log("---- RESET");
						creep.memory.motive.motivation = "";
						creep.memory.motive.need = "";
					}
				}
				break;
		}
	}
};