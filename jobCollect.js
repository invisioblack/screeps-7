var jobHelpers = require('jobHelpers')();

module.exports = function()
{
	//declare base object
	var jobCollect = function() {};
	//-------------------------------------------------------------------------

	jobCollect.work = function (creep)
	{
		//avoid hostiles
		if (jobHelpers.avoidHostile(creep))
			return;

		var dropped = creep.pos.findNearest(Game.DROPPED_ENERGY);
		if (dropped)
		{
			if (creep.energy == creep.energyCapacity)
			{
				creep.moveTo(creep.pos.findNearest(Game.MY_SPAWNS));
				creep.transferEnergy(creep.pos.findNearest(Game.MY_SPAWNS));
			}
			else
			{
				creep.moveTo(dropped);
				creep.pickup(dropped);
			}
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobCollect;
}