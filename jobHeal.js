var jobHelpers = require('jobHelpers')();

module.exports = function()
{
	//declare base object
	var jobHeal = function() {};
	//-------------------------------------------------------------------------

	jobHeal.work = function (creep)
	{
		//Need a avoid enemies behavior
		//Needs a return to some point behavior when not healing

		var needsHealing = [ ];

		//Find my creeps that are hurt. If they're hurt, heal them.
		var target = creep.pos.findNearest(Game.MY_CREEPS, {
			filter: function(t)
			{
				return t.hits < t.hitsMax
			}
		});

		if(target)
		{
			creep.moveTo(target);
			creep.heal(target);
		}
		else
		{
			var creepSpawn = Game.spawns[creep.memory.spawn];
			jobHelpers.moveToRange(creep, creepSpawn, 3);
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobHeal;
}