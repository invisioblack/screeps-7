//-------------------------------------------------------------------------
// jobHeal
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
module.exports = 
{
	//-------------------------------------------------------------------------

	"work": function (creep)
	{
		//avoid hostiles
		if (creep.avoidHostile(creep, 3))
		{
			return;
		}

		//Find my creeps that are hurt. If they're hurt, heal them.
		var healTarget = creep.pos.findNearest(Game.MY_CREEPS, {
			filter: function (t)
			{
				return t != creep && t.hits < t.hitsMax
			}
		});

		//if healing target then go in for the heal
		if (healTarget)
		{
			creep.moveTo(healTarget);
			creep.heal(healTarget);
		}
		else
		{
			var targets = creep.room.find(Game.HOSTILE_CREEPS);
			//if there are hostile targets stay near the action
			if (targets.length)
			{
				var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);

				if (target)
				{
					if (target.pos.inRangeTo(creep.pos, 2))
					{
						creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y);
					}
					else if (target.pos.inRangeTo(creep.pos, 3))
					{
						creep.rangedAttack(target);
					}
					else
					{
						creep.moveTo(target);
					}
				}

			} //go back home if it is boring
			else
			{
				creep.rendevous(creep, 3);
			}
		}
	}
};