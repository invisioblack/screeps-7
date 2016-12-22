//-------------------------------------------------------------------------
// jobHarvestSource
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require("lib");
var Job = require("prototype.job")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
var JobHarvestSource = function ()
{
	Job.call(this);
	this.name = "jobHarvestSource";
};

JobHarvestSource.prototype = Object.create(Job.prototype);
JobHarvestSource.prototype.constructor = JobHarvestSource;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobHarvestSource.prototype.work = function (creep)
{
	var need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
	var target = Game.getObjectById(need.targetId);
	var container = target.pos.findInRange(FIND_STRUCTURES, 1,{ filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; }});

	//avoid hostiles
	if (creep.avoidHostile(creep))
	{
		return;
	}

	if (lib.isNull(container))
	{
		creep.say("No container!");
		return;
	}

	// mark me as using this source
	creep.memory.sourceId = target.id;
	creep.memory.sourceType = this.JOB_SOURCETYPE_SOURCE;

	result = creep.harvest(target);

	//console.log("harvest: " + result);
	if (result == ERR_NOT_ENOUGH_ENERGY)
	{
		creep.say("Source Empty!");
	}
	if (result == ERR_NOT_IN_RANGE)
	{
		creep.moveTo(container.pos);
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobHarvestSource();