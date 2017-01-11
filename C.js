//-------------------------------------------------------------------------
// C - constants
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// definition
//-------------------------------------------------------------------------
module.exports =
{
	// priority
	'PRIORITY_8': 1,
	'PRIORITY_7': 2,
	'PRIORITY_6': 4,
	'PRIORITY_5': 8,
	'PRIORITY_4': 16,
	'PRIORITY_3': 24,
	'PRIORITY_2': 32,
	'PRIORITY_1': 40,

	'ROOM_ENERGYPICKUPMODE_NOENERGY': 0,
	'ROOM_ENERGYPICKUPMODE_HARVEST': 1,
	'ROOM_ENERGYPICKUPMODE_CONTAINER': 2,
	'ROOM_ENERGYPICKUPMODE_STORAGE': 3,
	'ROOM_ENERGYPICKUPMODE_LINK': 4, // this will remain unimplementing until I write up some link code
	
	'CPU_THROTTLE_NORMAL': 0,
	'CPU_THROTTLE_THIRD': 1,
	'CPU_THROTTLE_HALF': 2,
	'CPU_THROTTLE_QUARTER': 3,

	'COLOR_GREEN': "#00BB11",
	'COLOR_YELLOW': "#AAAA00",
	'COLOR_RED': "#CC0011",

	'THREAT_STANDBY': 0,
	'THREAT_VISITOR': 1,
	'THREAT_ALERT': 2,
	'THREAT_NPC': 3,
	'THREAT_PLAYER': 4,
	'THREAT_PANIC': 5
};