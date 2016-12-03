//-------------------------------------------------------------------------
// pCreep
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
module.exports = function() 
{
    Creep.prototype.moveToRange = function (creep, target, range)
	{
		if (target.pos.inRangeTo(creep.pos, range - 1))
		{
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y);
			return true;
		}
		else if (target.pos.inRangeTo(creep.pos, range))
		{
			return true;
		}
		else
		{
			creep.moveTo(target);
			return true;
		}
	};

	Creep.prototype.avoidHostile = function (creep, range)
	{
		if (typeof(range) === 'undefined')
		{
			range = 3;
		}
		var inRange = creep.pos.findInRange(Game.HOSTILE_CREEPS, range);
		if (inRange && inRange.length)
		{
			var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
			if (target)
			{
				creep.moveAwayFromTarget(creep, target);
				return true;
			}
		}
		return false;
	};

	Creep.prototype.moveAwayFromTarget = function (creep, target)
	{
		var avoid = creep.pos.getDirectionTo(target);
		creep.move((avoid + 4) % 8);
	};

	Creep.prototype.rendevous = function (creep, range)
	{
		var flags = creep.room.find(Game.FLAGS, {'name': 'Flag1'});

		if (creep.memory.rendevous)
		{
			creep.moveToRange(creep, creep.memory.rendevous, range);
		}
		else if (flags && flags.length)
		{
			var flag = flags[0];
			creep.moveToRange(creep, flag, range);
		}
		else
		{
			var creepSpawn = Game.spawns[creep.memory.spawn];
			creep.moveToRange(creep, creep.getSpawn(), range);
		}
	};
    
    Creep.prototype.carrying = function()
    {
        var result = 0;

        if (this.carryCapacity > 0)
        {
            result = _.sum(this.carry);
        }
        
        return result;
    };
    
    Creep.prototype.percentFull = function()
    {
        var percent = 0;

        if (this.carryCapacity > 0)
        {
            percent = (this.carrying / this.carryCapacity) * 10000 / 100
        }
        
        return percent;
    };

	Creep.prototype.getSpawn = function()
	{
		// This needs to be null protected.
		var creepSpawn = Game.spawns[creep.memory.spawn];
		return creepSpawn;		
	};

	Creep.prototype.getUnit = function()
	{
		// This needs to be null protected.
		var unit = this.memory.unit;
		return unit;		
	};
};