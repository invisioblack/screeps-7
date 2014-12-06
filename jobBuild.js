module.exports = function()
{
	//declare base object
	var jobBuild = function() {};
	//-------------------------------------------------------------------------

	jobBuild.work = function (creep)
	{       
		if(creep.energy === 0) {

			creep.moveTo(Game.spawns[creep.memory.spawn]);
			Game.spawns[creep.memory.spawn].transferEnergy(creep);
		}
		else
		{
			var neartarget = creep.pos.findNearest(Game.CONSTRUCTION_SITES);
			if(neartarget)
			{
				creep.moveTo(neartarget);
				creep.build(neartarget);
			}
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobBuild;
}