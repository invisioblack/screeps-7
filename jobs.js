module.exports =
{
	"build": {
		"means": [Game.WORK, Game.CARRY, Game.MOVE]
	},
	"collect": {
		"means": [Game.CARRY, Game.MOVE]
	},
	"guard": {
		"means": [Game.ATTACK, Game.MOVE]
	},
	"harvest": {
		"means": [Game.WORK, Game.MOVE]
	},
	"heal": {
		"means": [Game.HEAL, Game.MOVE]
	},
	"rangedGuard": {
		"means": [Game.RANGED_ATTACK, Game.MOVE]
	},
// not implemented
	"deliver": {
		"means": [Game.CARRY, Game.MOVE]
	},
	"turret": {
		"means": [Game.RANGED_ATTACK]
	}
};