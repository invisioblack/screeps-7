module.exports =
{
	"worker": {
		1: {
			"parts": [Game.CARRY, Game.WORK, Game.MOVE],
			"memory": {
				"name": "worker",
				"level": 1
			}
		},
		2: {
			"parts": [Game.WORK, Game.CARRY, Game.WORK, Game.MOVE],
			"memory": {
				"name": "worker",
				"level": 2
			}
		},
		3: {
			"parts": [Game.CARRY, Game.WORK, Game.WORK, Game.MOVE, Game.MOVE],
			"memory": {
				"name": "worker",
				"level": 3
			}
		}
	},
	"guard": {
		1: {
			"parts": [Game.ATTACK, Game.MOVE],
			"memory": {
				"name": "guard",
				"level": 1
			}
		},
		2: {
			"parts": [Game.TOUGH, Game.ATTACK, Game.MOVE],
			"memory": {
				"name": "guard",
				"level": 2
			}
		},
		3: {
			"parts": [Game.TOUGH, Game.TOUGH, Game.ATTACK, Game.ATTACK, Game.MOVE],
			"memory": {
				"name": "guard",
				"level": 3
			}
		}
	},
	"healer": {
		1: {
			"parts": [Game.HEAL, Game.MOVE],
			"memory": {
				"name": "healer",
				"level": 1
			}
		},
		2: {
			"parts": [Game.TOUGH, Game.HEAL, Game.MOVE],
			"memory": {
				"name": "healer",
				"level": 2
			}
		},
		3: {
			"parts": [Game.TOUGH, Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE],
			"memory": {
				"name": "healer",
				"level": 3
			}
		}
	},
	"archer": {
		1: {
			"parts": [Game.TOUGH, Game.TOUGH, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE],
			"memory": {
				"name": "archer",
				"level": 1
			}
		}
	}
}