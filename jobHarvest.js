module.exports = function()
{
	//declare base object
	var jobHarvest = function() {};
	//-------------------------------------------------------------------------

	jobHarvest.work = function (creep)
	{
		if(creep.energy < creep.energyCapacity) {
			var sources = creep.pos.findNearest(Game.SOURCES);
			creep.moveTo(sources);
			creep.harvest(sources);
		}
		else {
			var target = creep.pos.findNearest(Game.MY_SPAWNS);

			creep.moveTo(target);
			creep.transferEnergy(target);
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobHarvest;
}