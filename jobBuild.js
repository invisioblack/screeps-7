var jobHelpers = require('jobHelpers')();

module.exports = function()
{
	//declare base object
	var jobBuild = function() {};
	//-------------------------------------------------------------------------

	jobBuild.work = function (creep)
	{       
		//avoid hostiles
		if (jobHelpers.avoidHostile(creep))
			return;

		//continue if no nearby hostiles
		var neartarget = creep.pos.findNearest(Game.CONSTRUCTION_SITES);

		if (creep.energy === 0)
		{
			creep.memory.building = false;
		}
		if (creep.energy == creep.energyCapacity)
		{
			creep.memory.building = true;	
		}

		if(creep.energy < creep.energyCapacity && !creep.memory.building)
		{
			//this isn't null protected
			var mySpawn = Game.spawns[creep.memory.spawn];
			var spawnPath = creep.pos.findPathTo(mySpawn);
			var nearSource = creep.pos.findNearest(Game.SOURCES);
			var sourcePath = creep.pos.findPathTo(nearSource);

			if (spawnPath.length <= sourcePath.length && mySpawn.energy > 100)
			{
				creep.moveTo(Game.spawns[creep.memory.spawn]);
				Game.spawns[creep.memory.spawn].transferEnergy(creep);
			}
			else
			{
				creep.moveTo(nearSource);
				creep.harvest(nearSource);
			}
		}
		else
		{
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