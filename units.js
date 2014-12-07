module.exports =
{
	"worker": {
		"parts": [Game.CARRY, Game.WORK, Game.WORK, Game.MOVE, Game.MOVE],
		"memory": {
			"name": "worker"
		}
	},
	"guard": {
		"parts": [Game.TOUGH, Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.MOVE],
		"memory": {
			"name": "guard"
		}
	},
	"healer": {
		"parts": [Game.HEAL, Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE],
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
}