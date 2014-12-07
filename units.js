module.exports =
{
	"worker": {
		"parts": [Game.CARRY, Game.WORK, Game.Work, Game.MOVE, Game.MOVE],
		"memory": {
			"name": "worker"
		}
	},
	"guard": {
		"parts": [Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK],
		"memory": {
			"name": "guard"
		}
	},
	"healer": {
		"parts": [Game.HEAL, Game.MOVE],
		"memory": {
			"name": "healer"
		}	
	},
	"archer": {
		"parts": [Game.TOUGH, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK],
		"memory": {
			"name": "archer"
		}
	}
}