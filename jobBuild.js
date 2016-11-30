//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = function ()
{
	//declare base object
	var jobBuild = function () {};
	//-------------------------------------------------------------------------

	jobBuild.work = function (creep)
	{
		//avoid hostiles
		if (creep.avoidHostile(creep))
		{
			return;
		}

		//continue if no nearby hostiles
		//TODO: This needs to be defined by the need.
		var neartarget = creep.pos.findNearest(Game.CONSTRUCTION_SITES);

		if (creep.energy === 0)
		{
			creep.memory.building = false;
		}
		if (creep.energy == creep.energyCapacity)
		{
			creep.memory.building = true;
		}

		// If I don't have full energy, and I'm not building right now, then go get energy
		if (creep.energy < creep.energyCapacity && !creep.memory.building)
		{
			//this isn't null protected
			var mySpawn = creep.getSpawn();
			var spawnPath = creep.pos.findPathTo(mySpawn);
			var nearSource = creep.pos.findNearest(Game.SOURCES);
			var sourcePath = creep.pos.findPathTo(nearSource);

			if (spawnPath.length <= sourcePath.length && mySpawn.energy > 100)
			{
				creep.moveTo(mySpawn);
				mySpawn.transferEnergy(creep);
			}
			else
			{
				creep.moveTo(nearSource);
				creep.harvest(nearSource);
			}
		}
		// otherwise, go build!
		else
		{
			if (neartarget)
			{
				creep.moveTo(neartarget);
				creep.build(neartarget);
			}
		}
	};
	//-------------------------------------------------------------------------
	//return populated object
	return jobBuild;
};