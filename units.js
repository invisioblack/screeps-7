// TODO: implement max property
module.exports =
{
	"worker": {
		"mode": 1,
		"parts": [
			{
				"part" : WORK,
				"weight" : 0.4,
				"minimum" : 1
			},
			{
				"part" : CARRY,
				"weight" : 0.3,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.3,
				"minimum" : 1
			}
		],
		"memory": {
			"unit": "worker"
		}
	},

	"harvester": {
		"mode": 2,
		"parts": [
			WORK,
			WORK,
			WORK,
			WORK,
			WORK,
			MOVE
		],
		"memory": {
			"unit": "harvester"
		}
	},
	"hauler": {
		"mode": 1,
		"parts": [
			{
				"part" : CARRY,
				"weight" : 0.5,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.5,
				"minimum" : 1
			}
		],
		"memory": {
			"unit": "hauler"
		}
	},
	"guard": {
		"mode": 1,
		"parts": [
			{
				"part" : TOUGH,
				"weight" : 0.1,
				"minimum" : 0
			},
			{
				"part" : ATTACK,
				"weight" : 0.5,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.4,
				"minimum" : 1
			}
		],
		"memory": {
			"unit": "guard"
		}
	},
	"rangedGuard": {
		"mode": 1,
		"parts": [
			{
				"part" : TOUGH,
				"weight" : 0.1,
				"minimum" : 0
			},
			{
				"part" : ATTACK,
				"weight" : 0.6,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.3,
				"minimum" : 1
			}
		],
		"memory": {
			"unit": "rangedGuard"
		}
	},
	"heal": {
		"mode": 1,
		"parts": [
			{
				"part" : TOUGH,
				"weight" : 0.1,
				"minimum" : 0
			},
			{
				"part" : HEAL,
				"weight" : 0.6,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.3,
				"minimum" : 1
			}
		],
		"memory": {
			"unit": "heal"
		}
	}

};