"use strict";
module.exports =
	{
		"unit": {
			"min": {
				"worker": 3 ,
				"hauler": 2
			}
		} ,
		"critWorkers": 2 ,
		"minWorkers": 2 ,
		"medWorkers": 3 ,
		"maxWorkers": [1 , 8 , 7 , 6 , 6 , 5 , 4 , 3 , 2] ,
		"maxHaulers": 4 ,
		"alertTime": 200 ,
		"wallHP": [0 , 5000 , 10000 , 10000 , 300000 , 500000 , 1000000 , 1500000 , 2000000] ,
		"claimTicks": 1000 ,
		'repairFactor': 0.8 ,
		'towerPowerFactor': 0.8 ,
		'towerRepairFactor': 1 ,
		"cpuDebug": false ,
		"cpuDetailDebug": false ,
		"cpuInitDebug": false ,
		"cpuLoopDebug": false ,
		"cpuRoomDebug": false ,
		"cpuMotivateDebug": false ,
		"cpuNeedsDebug": false ,
		"cpuNeedsUpdateDebug": false ,
		"cpuNeedsUnitDebug": false ,
		"cpuHistorySize": 1000 ,
		"cpuThresholdThird": 1000 ,
		"cpuThresholdHalf": 500 ,
		"cpuThresholdQuarter": 200 ,
		"harvesterPrespawnTicks": 150
	};