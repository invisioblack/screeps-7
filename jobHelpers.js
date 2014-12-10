module.exports = function()
{
	//declare base object
	var jobHelpers = function() {};
	//-------------------------------------------------------------------------
	
	jobHelpers.moveToRange = function (creep, target, range)
	{
		if (target.pos.inRangeTo(creep.pos, range - 1)) {
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y );
			return true;
		} else if (target.pos.inRangeTo(creep.pos, range)) {
			return true;
		}
		else {
			creep.moveTo(target);
			return true;
		}
	};

	jobHelpers.avoidHostile = function (creep, range)
	{
		if(typeof(range)==='undefined') range = 3;
		var inRange = creep.pos.findInRange(Game.HOSTILE_CREEPS, range);
		if (inRange && inRange.length)
		{
			var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
			if (target)
			{
				jobHelpers.moveAwayFromTarget(creep, target);
				return true;
			}
		}
		return false;
	};

	jobHelpers.moveAwayFromTarget = function (creep, target)
	{
		var avoid = creep.pos.getDirectionTo(target);
		creep.move((avoid+4)%8);
	};

	jobHelpers.rendevous = function (creep, range)
	{
		var flags = creep.room.find(Game.FLAGS, { 'name': 'Flag1'});

		if (creep.memory.rendevous)
		{
			jobHelpers.moveToRange(creep, creep.memory.rendevous, range);
		}
		else if (flags && flags.length)
		{
			var flag = flags[0];
			jobHelpers.moveToRange(creep, flag, range);
		}
		else
		{
			var creepSpawn = Game.spawns[creep.memory.spawn];
			jobHelpers.moveToRange(creep, creepSpawn, range);
		}
	};

	//-------------------------------------------------------------------------
	//return populated object
	return jobHelpers;
}