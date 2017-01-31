//-------------------------------------------------------------------------
// C - constants
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// definition
//-------------------------------------------------------------------------
module.exports =
{
	'ME': "Timendainum",
	// priority
	'PRIORITY_8': 1,
	'PRIORITY_7': 2,
	'PRIORITY_6': 4,
	'PRIORITY_5': 8,
	'PRIORITY_4': 16,
	'PRIORITY_3': 24,
	'PRIORITY_2': 32,
	'PRIORITY_1': 40,

	'ROOM_MODE_ENEMY': -5,
	'ROOM_MODE_KEEPER': -4,
	'ROOM_MODE_REMOTE_HARVEST_SIEGE': -3,
	'ROOM_MODE_SIEGE': -2,
	'ROOM_MODE_WORKER_PANIC': -1,
	'ROOM_MODE_NEUTRAL': 0,
	'ROOM_MODE_REMOTE_HARVEST': 1,
	'ROOM_MODE_ALLY': 2,
	'ROOM_MODE_NORMAL': 10,
	'ROOM_MODE_SETTLE': 11,

	'ROOM_ENERGYPICKUPMODE_NOENERGY': 0,
	'ROOM_ENERGYPICKUPMODE_HARVEST': 1,
	'ROOM_ENERGYPICKUPMODE_PRECONTAINER': 2,
	'ROOM_ENERGYPICKUPMODE_CONTAINER': 3,
	'ROOM_ENERGYPICKUPMODE_STORAGE': 4,
	'ROOM_ENERGYPICKUPMODE_LINK': 5,
	
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
	'THREAT_PANIC': 5,

	"RELATION_HOSTILE": -1,
	"RELATION_NEUTRAL": 0,
	"RELATION_TRUCE": 1,
	"RELATION_TRUSTED": 2,
	"RELATION_ALLY": 3,
	"RELATION_ME": 4
};