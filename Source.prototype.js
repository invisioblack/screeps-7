//-------------------------------------------------------------------------
// prototype.source
//-------------------------------------------------------------------------


Source.prototype.getPercentFull = function()
{
    return (this.energy / this.energyCapacity) * 10000 / 100;
};

Source.prototype.getMaxHarvesters = function ()
{
    let result = 0;
    let area = this.room.lookForAtArea(LOOK_TERRAIN, lib.clamp(this.pos.y - 1, 0, 49), lib.clamp(this.pos.x - 1, 0, 49), lib.clamp(this.pos.y + 1, 0, 49), lib.clamp(this.pos.x + 1, 0, 49), true);

    area.forEach(function(p) {
		if ( !(p.x == this.pos.x && p.y === this.pos.y) && p.terrain != 'wall')
		{
			result++;
		}
    }, this);

    // room hack
    if (this.room.name === "W13S77")
    	result--;

    return result;
};

Source.prototype.countCreepsOnSource = function ()
{
	let result = 0;

	for (let creepName in Game.creeps)
	{
		let creep = Game.creeps[creepName];
		if (!lib.isNull(creep.memory.sourceId))
		{
			if (creep.memory.sourceId == this.id)
				result++;
		}
	}

	return result;
};

Source.prototype.countHarvestersOnSource = function ()
{
	let result = 0;

	for (let creepName in Game.creeps)
	{
		let creep = Game.creeps[creepName];
		if (!lib.isNull(creep.memory.sourceId) && creep.memory.unit === "harvester")
		{
			if (creep.memory.sourceId == this.id)
				result++;
		}
	}

	return result;
};

module.exports = function() {};