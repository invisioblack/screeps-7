"use strict";

if (Source.prototype.hasOwnProperty('percentFull') === false)
{
	Object.defineProperty(Source.prototype , "percentFull" , {
		get: function ()
		{
			return (this.energy / this.energyCapacity) * 10000 / 100;
		}
	});
}

if (Source.prototype.hasOwnProperty('maxHarvesters') === false)
{
	Object.defineProperty(Source.prototype , "maxHarvesters" , {
		get: function ()
		{
			let result = 0;
			let area = this.room.lookForAtArea(LOOK_TERRAIN , lib.clamp(this.pos.y - 1 , 0 , 49) , lib.clamp(this.pos.x - 1 , 0 , 49) , lib.clamp(this.pos.y + 1 , 0 , 49) , lib.clamp(this.pos.x + 1 , 0 , 49) , true);

			area.forEach(p =>
			{
				if (!(p.x === this.pos.x && p.y === this.pos.y) && p.terrain != 'wall')
				{
					result++;
				}
			} , this);

			return result;
		}
	});
}

if (Source.prototype.hasOwnProperty('creepsOn') === false)
{
	Object.defineProperty(Source.prototype , "creepsOn" , {
		get: function ()
		{
			return _.filter(Game.creeps , creep => !lib.isNull(creep.memory.sourceId) && creep.memory.sourceId === sourceId);
		}
	});
}

module.exports = function ()
{
};