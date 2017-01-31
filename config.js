"use strict";
module.exports =
	{
		"unit": {
			"min": {
				"worker": 2 ,
				"hauler": 2
			},
			"max": {
				"worker": 4 ,
				"hauler": 4
			}
		} ,
		"alertTime": 200 ,
		"wallHP": [0 , 5000 , 10000 , 10000 , 300000 , 500000 , 1000000 , 1500000 , 2000000] ,
		"claimTicks": 1000 ,
		'repairFactor': 0.8 ,
		'towerPowerFactor': 0.8 ,
		'towerRepairFactor': 1 ,
		"cpuDebug": true ,
		"cpuDetailDebug": true ,
		"cpuInitDebug": true ,
		"cpuInitDetailDebug": false ,
		"cpuLoopDebug": true ,
		"cpuRoomDebug": true ,
		"cpuRoomDetailDebug": false ,
		"cpuMotivateDebug": true ,
		"cpuMotivateDetailDebug": false ,
		"cpuMotivateInitDebug": false ,
		"cpuNeedsDebug": true ,
		"cpuNeedsUpdateDebug": false ,
		"cpuNeedsUnitDebug": false ,
		"cpuHandleLostDebug": true ,
		"cpuHistorySize": 1000 ,
		"cpuThresholdThird": 1000 ,
		"cpuThresholdHalf": 500 ,
		"cpuThresholdQuarter": 200 ,
		"harvesterPrespawnTicks": 150
	};