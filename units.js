module.exports =
{
	"worker": {
		"parts": [Game.CARRY, Game.WORK, Game.MOVE],
		"memory": {
			"name": "worker"
		}
	},
	"guard": {
		"parts": [Game.TOUGH, Game.MOVE, Game.ATTACK],
		"memory": {
			"name": "guard"
		}
	}
}