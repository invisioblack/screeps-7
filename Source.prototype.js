//-------------------------------------------------------------------------
// prototype.source
//-------------------------------------------------------------------------


Source.prototype.getPercentFull = function()
{
    return (this.energy / this.energyCapacity) * 10000 / 100;
};

Source.prototype.getMaxHarvesters = function ()
{
    var result = 0;
    var area = this.room.lookForAtArea(LOOK_TERRAIN, lib.clamp(this.pos.y - 1, 0, 49), lib.clamp(this.pos.x - 1, 0, 49), lib.clamp(this.pos.y + 1, 0, 49), lib.clamp(this.pos.x + 1, 0, 49), true);

    area.forEach(function(p) {
		if ( !(p.x == this.pos.x && p.y === this.pos.y) && p.terrain != 'wall')
		{
			result++;
		}
    }, this);

    return result;
};

Source.prototype.countCreepsOnSource = function ()
{
	var result = 0;

	for (var creepName in Game.creeps)
	{
		var creep = Game.creeps[creepName];
		if (!lib.isNull(creep.memory.sourceId))
		{
			if (creep.memory.sourceId == this.id)
				result++;
		}
	}

	return result;
};
module.exports = function() {};