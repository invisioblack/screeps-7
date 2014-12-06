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
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobAttack;
}