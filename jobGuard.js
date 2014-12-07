var jobHelpers = require('jobHelpers')();

module.exports = function()
{
	//declare base object
	var jobGuard = function() {};
	//-------------------------------------------------------------------------

	jobGuard.work = function (creep)
	{
		var targets = creep.room.find(Game.HOSTILE_CREEPS);

		if (targets.length) {
			var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
			if (target)
			{
				creep.moveTo(target);
				creep.attack(target);
			}
		}
		else
		{
			jobHelpers.rendevous(creep, 5);
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobGuard;
}