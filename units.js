module.exports =
{
	"teamster": {
		"mode": 1,
		"parts": [
			{
				"part" : CARRY,
				"weight" : 0.7,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.3,
				"minimum" : 1
			}
		],
		"memory": {
			"unit": "teamster"
		}
	},
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
				"weight" : 0.4,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.2,
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
	}

};