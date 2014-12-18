module.exports =
{
	0: {
		"name": "nothing" ,
		"means": []
	} ,
	1: {
		"name": "build" ,
		"means": [Game.WORK, Game.CARRY, Game.MOVE]
	},
	2: {
		"name": "collect" ,
		"means": [Game.CARRY, Game.MOVE]
	},
	3: {
		"name": "guard" ,
		"means": [Game.ATTACK, Game.MOVE]
	},
	4: {
		"name": "guard" ,
		"means": [Game.WORK, Game.MOVE]
	},
	5: {
		"name": "heal" ,
		"means": [Game.HEAL, Game.MOVE]
	},
	6: {
		"name": "rangedGuard" ,
		"means": [Game.RANGED_ATTACK, Game.MOVE]
	},
// not implemented
	7: {
		"name": "deliver" ,
		"means": [Game.CARRY, Game.MOVE]
	},
	8: {
		"name": "turret" ,
		"means": [Game.RANGED_ATTACK]
	}
};