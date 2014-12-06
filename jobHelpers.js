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
	}
	//-------------------------------------------------------------------------
	//return populated object
	return jobHelpers;
}