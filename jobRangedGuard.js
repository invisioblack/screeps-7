//-------------------------------------------------------------------------
// jobGuard
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
		var targets = creep.room.find(Game.HOSTILE_CREEPS);

		if (targets.length) {
			var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);

			if (target)
			{
				if (target.pos.inRangeTo(creep.pos, 2)) {
					creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y );
				} else if (target.pos.inRangeTo(creep.pos, 3)) {
					creep.rangedAttack(target);
				}
				else {
					creep.moveTo(target);
				}
			}
		}
		else
		{
			creep.rendevous(creep, 4);
		}
	}
};