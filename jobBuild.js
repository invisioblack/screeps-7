//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require("lib");
//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------
var HARVEST_MODE_HARVEST = 0;
var HARVEST_MODE_BUILD = 1;

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
				creep.memory.job.mode = HARVEST_MODE_HARVEST;
			}

			// manage job
			switch (creep.memory.job.mode)
			{
				case HARVEST_MODE_HARVEST:
					if (carry == creep.carryCapacity)
					{
						creep.memory.job.mode = HARVEST_MODE_BUILD;
					} else {
						//console.log("harvest:" + source);
						if (creep.harvest(source) == ERR_NOT_IN_RANGE)
						{
							creep.moveTo(source);
						}
					}
					break;
				case HARVEST_MODE_BUILD:
					if (carry == 0)
					{
						creep.memory.job.mode = HARVEST_MODE_HARVEST;
						creep.deassignMotive();
					} else {
						//console.log("return: " + target);
						var result = creep.build(target);
						if (result == ERR_NOT_IN_RANGE)
						{
							creep.moveTo(target);
						} else if (result == ERR_INVALID_TARGET) {
							//console.log("---- RESET");
							creep.deassignMotive();
						}
					}
					break;
			}
		}
	};