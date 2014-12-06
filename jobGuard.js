var jobHelpers = require('jobHelpers')();

module.exports = function()
{
	//declare base object
	var jobGuard = function() {};
	//-------------------------------------------------------------------------

	jobGuard.work = function (creep)
	{
		var targets = creep.room.find(Game.HOSTILE_CREEPS);
		var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
		if (targets.length) {
			creep.moveTo(target);
			creep.attack(target);
		}
		else
		{
			var creepSpawn = Game.spawns[creep.memory.spawn];
			jobHelpers.moveToRange(creep, creepSpawn, 5);
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobGuard;
}