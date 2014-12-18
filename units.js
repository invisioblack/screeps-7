module.exports =
{
	"worker": {
		"jobId": 4 ,
		1: {
			"parts": [Game.WORK, Game.WORK, Game.WORK, Game.WORK, Game.MOVE],
			"memory": {
				"name": "worker",
				"level": 1
			}
		}
	},
	"collector": {
		"jobId": 2 ,
		1: {
			"parts": [Game.CARRY, Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE],
			"memory": {
				"name": "collector" ,
				"level": 1
			}
		}
	},
	"guard": {
		"jobId": 3 ,
		1: {
			"parts": [Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE],
			"memory": {
				"name": "guard",
				"level": 1
			}
		}
	},
	"healer": {
		"jobId": 5 ,
		1: {
			"parts": [Game.TOUGH, Game.HEAL, Game.HEAL, Game.HEAL, Game.MOVE],
			"memory": {
				"name": "healer",
				"level": 1
			}
		}
	},
	"archer": {
		"jobId": 6 ,
		1: {
			"parts": [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE],
			"memory": {
				"name": "archer",
				"level": 1
			}
		}
	}
};