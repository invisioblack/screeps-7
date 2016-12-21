//-------------------------------------------------------------------------
// prototype.job
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require("lib");
//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = function()
{
	var Job = function () {};

	Job.prototype.JOB_MODE_GETENERGY = 0;
	Job.prototype.JOB_MODE_WORK = 1;

	Job.prototype.JOB_SOURCETYPE_NOTHING = 0;
	Job.prototype.JOB_SOURCETYPE_DROP = 1;
	Job.prototype.JOB_SOURCETYPE_CONTAINER = 2;
	Job.prototype.JOB_SOURCETYPE_SOURCE = 3;

	Job.prototype.getEnergy = function (creep)
	{
		//console.log("***getEnergy()");
		// declarations
		var carry, source;

		// confirm that creep can attempt this job
		if (creep.carryCapacity == 0)
		{
			creep.say("Can't Carry!");
			creep.deassignMotive();
			delete creep.memory.sourceId;
			delete creep.memory.sourceType;

			return;
		}

		// get information
		carry = _.sum(creep.carry);

		// if I am full, then reset into work mode ---------------------------------------------------------------------
		if (carry == creep.carryCapacity)
		{
			creep.say("Full!");
			creep.memory.job.mode = this.JOB_MODE_WORK;
			this.resetSource(creep);
		}

		// get some energy ---------------------------------------------------------------------------------------------

		// init sourceId storage
		if (lib.isNull(creep.memory.sourceId) || lib.isNull(creep.memory.sourceType))
		{
			this.resetSource(creep);
		}

		// validate energy source
		if (creep.memory.sourceId != "")
		{
			source = Game.getObjectById(creep.memory.sourceId);

			if (lib.isNull(source))
			{
				this.resetSource(creep);
			}
		}

		// if we're not assigned a source, then look for energy on the ground
		if (creep.memory.sourceId == "")
		{
			var droppedEnergy;

			// look for energy laying on the ground
			droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
			droppedEnergy.forEach(function (drop) {
				if (creep.memory.sourceId == "" && this.countCreepsOnSource(drop.id) == 0)
				{
					creep.memory.sourceId = drop.id;
					creep.memory.sourceType = this.JOB_SOURCETYPE_DROP;
				}
			}, this);
		}

		// look for energy in containers
		if (creep.memory.sourceId == "")
		{
			var container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0; }});
			if (!lib.isNull(container))
			{
				creep.memory.sourceId = container.id;
				creep.memory.sourceType = this.JOB_SOURCETYPE_CONTAINER;
			}
		}

		//console.log("harvest: " + creep.memory.sourceId);

		// harvest my own energy
		if (creep.memory.sourceId == "" && creep.getHasPart(WORK))
		{
			var sources = creep.room.find(FIND_SOURCES);
			sources.forEach(function (s) {
				var max = s.getMaxHarvesters();
				var on = this.countCreepsOnSource(s.id);
				//console.log("source/max/on: " + s.id + "/" + max + "/" + on);

				if(max > on && creep.memory.sourceId == "")
				{
					creep.memory.sourceId = s.id;
					creep.memory.sourceType = this.JOB_SOURCETYPE_SOURCE;
				}
			}, this);
		}

		// check to see if I can get energy, if so get it, if not, complain
		if (creep.memory.sourceId == "") // I'm screwed, I cannot get energy
		{
			creep.say("No Energy!");
		} else { // move to and pick up the goods
			switch (creep.memory.sourceType)
			{
				case this.JOB_SOURCETYPE_DROP:
					var drop = Game.getObjectById(creep.memory.sourceId);
					if (creep.pickup(drop) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(drop);
					}
					break;
				case this.JOB_SOURCETYPE_CONTAINER:
					var container = Game.getObjectById(creep.memory.sourceId);
					if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(container);
					}
					break;
				case this.JOB_SOURCETYPE_SOURCE:
					var source = Game.getObjectById(creep.memory.sourceId);
					if (creep.harvest(source) == ERR_NOT_IN_RANGE)
					{
						creep.moveTo(source);
					}
					break;
			}
		}

/*
		} else {
			//console.log("harvest:" + source);

		}
*/
		// can't find energy!

	};

	Job.prototype.countCreepsOnSource = function (sourceId)
	{
		var result = 0;

		for (var creepName in Game.creeps)
		{
			var creep = Game.creeps[creepName];
			if (!lib.isNull(creep.memory.sourceId))
			{
				if (creep.memory.sourceId == sourceId)
					result++;
			}
		}

		return result;
	};

	Job.prototype.resetSource = function (creep)
	{
		creep.memory.sourceId = "";
		creep.memory.sourceType = this.JOB_SOURCETYPE_NOTHING;
	};

	return Job;
};