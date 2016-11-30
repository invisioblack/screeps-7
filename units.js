module.exports =
{
	"worker": {
		"parts": [
			{
				"part" : Game.WORK,
				"weight" : 0.5,
				"minimum" : 1
			},
			{
				"part" : Game.CARRY,
				"weight" : 0.3,
				"minimum" : 1
			},
			{
				"part" : Game.MOVE,
				"weight" : 0.2,
				"minimum" : 1
			}
		],
		"memory": {
			"name": "worker"
		}
	},
	"guard": {
		"parts": [Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE],
		"memory": {
			"name": "guard"
		}
	},
	"healer": {
		"parts": [Game.TOUGH, Game.HEAL, Game.HEAL, Game.HEAL, Game.MOVE],
		"memory": {
			"name": "healer"
		}
	},
	"archer": {
		"parts": [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE],
		"memory": {
			"name": "archer"
		}
	}
};