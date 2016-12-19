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
				"weight" : 0.4,
				"minimum" : 1
			},
			{
				"part" : MOVE,
				"weight" : 0.1,
				"minimum" : 1
			}
		],
		"memory": {
			"unit": "worker"
		}
	}
};