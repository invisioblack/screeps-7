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
let JobManualTactical = function ()
{
	Job.call(this);
	this.name = "jobManualTactical";
};

JobManualTactical.prototype = Object.create(Job.prototype);
JobManualTactical.prototype.constructor = JobManualTactical;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
JobManualTactical.prototype.work = function (creep)
{
	creep.say("CHARGE!");

	if (Game.flags.spawn)
	{
		let spawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
		let result = creep.attack(spawn);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(spawn);
	}
	else if (Game.flags.wall)
	{
		let wall = Game.flags.wall.findClosestByPath(FIND_STRUCTURES, { filter: function (s) { return s.structureType === STRUCTURE_WALL} });
		let result = creep.attack(wall);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(wall);
	}
	else if (Game.flags.creep)
	{
		let target = creep.findClosestByPath(FIND_HOSTILE_CREEPS);
		let result = creep.attack(target);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(target);
	}
	else if (Game.flags.structure)
	{
		let target = creep.findClosestByPath(FIND_HOSTILE_STRUCTURES);
		let result = creep.attack(target);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(target);
	}
	else if (Game.flags.move)
	{
		let flag = Game.flags.move;
		let result = creep.moveTo(flag);
		if (result === ERR_NOT_IN_RANGE)
			creep.rendezvous(flag, 2);
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobManualTactical();

