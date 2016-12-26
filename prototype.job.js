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

		// look for energy laying on the ground
		var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
		droppedEnergy.forEach(function (drop) {
			//console.log("dropID: " + drop.id);
			if (creep.memory.sourceType != this.JOB_SOURCETYPE_DROP && this.countCreepsOnSource(drop.id) == 0)
			{
				//console.log("I'll get it! dropID: " + drop.id);
				creep.memory.sourceId = drop.id;
				creep.memory.sourceType = this.JOB_SOURCETYPE_DROP;
			}
		}, this);

		// look for energy in containers
		if (creep.memory.sourceId == "")
		{
			var container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= creep.carryCapacity; }});
			if (lib.isNull(container))
			{
				container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= 0; }});
			}

			//console.log(container.store[RESOURCE_ENERGY]);

			// second pass check and assign
			if (!lib.isNull(container) && container.store[RESOURCE_ENERGY] > 0)
			{
				creep.memory.sourceId = container.id;
				creep.memory.sourceType = this.JOB_SOURCETYPE_CONTAINER;
			}
		}



		// harvest my own energy
		if (creep.memory.sourceId == "" && creep.getHasPart(WORK))
		{
			var source = creep.pos.findClosestByRange(FIND_SOURCES, { filter: function (s)
			{
				var max = s.getMaxHarvesters();
				var on = s.countCreepsOnSource();
				return max > on && s.energy > 0;
			}});

			if (!lib.isNull(source))
			{
				creep.memory.sourceId = source.id;
				creep.memory.sourceType = this.JOB_SOURCETYPE_SOURCE;
			}
		}
		//console.log("harvest: " + creep.memory.sourceId);

		// check to see if I can get energy, if so get it, if not, complain
		if (creep.memory.sourceId == "") // I'm screwed, I cannot get energy
		{
			creep.say("No Energy!");
			if (carry > 0)
			{
				creep.memory.job.mode = this.JOB_MODE_WORK;
				this.resetSource(creep);
			}
		} else { // move to and pick up the goods
			var result;
			switch (creep.memory.sourceType)
			{
				case this.JOB_SOURCETYPE_DROP:
					var drop = Game.getObjectById(creep.memory.sourceId);
					result = creep.pickup(drop);
					if (result == ERR_NOT_IN_RANGE)
					{
						var moveResult = creep.moveTo(drop, {"maxRooms": 1});
						if (moveResult < 0 && moveResult != ERR_TIRED)
							console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					break;
				case this.JOB_SOURCETYPE_CONTAINER:
					var container = Game.getObjectById(creep.memory.sourceId);
					result = creep.withdraw(container, RESOURCE_ENERGY);
					if (result == ERR_NOT_IN_RANGE)
					{
						var moveResult = creep.moveTo(container, {"maxRooms": 1});
						if (moveResult < 0 && moveResult != ERR_TIRED)
							console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					if (container.store[RESOURCE_ENERGY] <= 10)
					{
						creep.say("Its Empty!");
						creep.memory.job.mode = this.JOB_MODE_WORK;
						this.resetSource(creep);
					}
					break;
				case this.JOB_SOURCETYPE_SOURCE:
					var source = Game.getObjectById(creep.memory.sourceId);
					result = creep.harvest(source);
					//console.log("harvest: " + result);
					if (result == ERR_NOT_ENOUGH_ENERGY)
					{
						this.resetSource(creep);
					}
					if (result == ERR_NOT_IN_RANGE)
					{
						var moveResult = creep.moveTo(source, {"maxRooms": 1});
						if (moveResult < 0 && moveResult != ERR_TIRED)
							console.log(creep.name + " Can't move while harvesting: " + moveResult);
					}
					break;
			}
		}
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