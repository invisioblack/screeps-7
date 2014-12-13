var jobHelpers = require('jobHelpers')();

module.exports = function ()
{
	//declare base object
	var jobCollect = function ()
	{
	};
	//-------------------------------------------------------------------------

	jobCollect.work = function (creep)
	{
		//avoid hostiles
		if (jobHelpers.avoidHostile(creep))
		{
			return;
		}

		var dropped = creep.pos.findNearest(Game.DROPPED_ENERGY);
		if (dropped)
		{
			if (creep.energy == creep.energyCapacity)
			{
				jobCollect.returnEnergy(creep);
			}
			else
			{
				creep.moveTo(dropped);
				creep.pickup(dropped);
			}
		}
		else if (creep.energy > 0)
		{
			jobCollect.returnEnergy(creep);
		}

	};

	jobCollect.returnEnergy = function (creep)
	{
		creep.moveTo(creep.pos.findNearest(Game.MY_SPAWNS));
		creep.transferEnergy(creep.pos.findNearest(Game.MY_SPAWNS));
	};
	//-------------------------------------------------------------------------
	//return populated object
	return jobCollect;

};