module.exports = function()
{
	//declare base object
	var jobBuild = function() {};
	//-------------------------------------------------------------------------

	jobBuild.work = function (creep)
	{       
		if(creep.energy === 0) {

			creep.moveTo(Game.spawns[creep.memory.parentSpawn]);
			Game.spawns[creep.memory.parentSpawn].transferEnergy(creep);
		}
		else {
			var neartarget = creep.pos.findNearest(Game.CONSTRUCTION_SITES);
			if(neartarget) {
			creep.moveTo(neartarget);
			creep.build(neartarget);
			}
		}
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobBuild;
}