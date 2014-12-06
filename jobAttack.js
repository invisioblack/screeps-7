module.exports = function()
{
	//declare base object
	var jobAttack = function() {};
	//-------------------------------------------------------------------------

	jobAttack.work = function (creep)
	{
		var targets = creep.room.find(Game.HOSTILE_CREEPS);
		if (targets.length) {
			creep.moveTo(targets[0]);
			creep.attack(targets[0]);
		}
		else
		{
			var creepSpawn = Game.spawns[creep.memory.spawn];
			if (!creep.pos.inRangeTo(creepSpawn.pos, 5))
			{
				creep.moveTo(creepSpawn);
			}
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobAttack;
}