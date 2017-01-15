//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
"use strict";
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
	creep.sing("For the glory of the empire!", true);
	if (Game.flags.heal && Game.flags.heal.room === creep.room && creep.hits < (creep.hitsMax * 0.8) || (!lib.isNull(creep.memory.healing) && creep.memory.healing))
	{
		creep.memory.healing = true;
		let flag = Game.flags.heal;
		let result = creep.moveTo(flag, { maxRooms: 1});
		if (result === ERR_NOT_IN_RANGE)
			creep.rendezvous(flag, 2);
		if (creep.hits === creep.hitsMax)
			creep.memory.healing = false;
	}
	else if (Game.flags.move && Game.flags.move.room === creep.room)
	{
		let flag = Game.flags.move;
		let result = creep.moveTo(flag, { maxRooms: 1});
		if (result === ERR_NOT_IN_RANGE)
			creep.rendezvous(flag, 2);
	}
	else if (Game.flags.move1 && Game.flags.heal.move1 === creep.room)
	{
		let flag = Game.flags.move1;
		let result = creep.moveTo(flag, { maxRooms: 1});
		if (result === ERR_NOT_IN_RANGE)
			creep.rendezvous(flag, 2);
	}
	else if (Game.flags.creep && Game.flags.creep.room === creep.room)
	{
		let target = Game.flags.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		let result = creep.attack(target);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(target, { maxRooms: 1});
	}
	else if (Game.flags.wall && Game.flags.wall.room === creep.room)
	{
		let wall = Game.flags.wall.pos.findClosestByPath(FIND_STRUCTURES, { filter: function (s) { return s.structureType === STRUCTURE_WALL} });
		let result = creep.attack(wall);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(wall);
	}
	else if (Game.flags.spawn && Game.flags.spawn.room === creep.room)
	{
		let spawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
		let result = creep.attack(spawn);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(spawn, { maxRooms: 1});
	}
	else if (Game.flags.structure && Game.flags.structure.room === creep.room)
	{
		let target = Game.flags.structure.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
		let result = creep.attack(target);
		if (result === ERR_NOT_IN_RANGE)
			creep.moveTo(target, { maxRooms: 1});
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new JobManualTactical();

