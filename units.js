module.exports =
{
	"worker": {
		"parts": [
			{
				"part" : WORK,
				"weight" : 0.5,
				"minimum" : 1
			},
			{
				"part" : CARRY,
				"weight" : 0.3,
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
	}
};