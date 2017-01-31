/**
 * TODO: implement ROOM_MODE_SETTLE
 * TODO: implement motivationAid
 * TODO: implement auto siege
 * TODO: implement siege defense
 * TODO: Implement labs and making boosts
 * TODO: Implement market
 * TODO: improve creep design
 *      utilize boosts
 * TODO: create linked room manager for console
 *      creep details and manager
 *      storage details
 *      memory details
 *      motivator details
 * TODO: create data reporting system
 *      collect data, store it in Memory.reporting
 *      allow turing entire system on and off
 *      use this to pull and track historical data
 *      store data by tick, auto cull old data
 */
"use strict";

//----------------------------------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------------------------------
//const profiler = require('screeps-profiler');
//profiler.enable();
// game prototypes
require('Creep.prototype');
require('Source.prototype');
require('Room.prototype');
require('RoomPosition.prototype');
require('Spawn.prototype');
require('StructureTower.prototype');
require('StructureLink.prototype');

require("globals");
require("logging");
require("shortcuts");

// global --------------------------------------------------------------------------------------------------------------
global.cpuUsedLast = 0;
cpuManager.log(">>>> Global Start <<<<");

// main loop -----------------------------------------------------------------------------------------------------------
module.exports.loop = function ()
{
	//profiler.wrap(function ()
	//{
		cpuManager.timerStart("++++ Loop ++++" , "loop");
		delete Memory.rooms[undefined]; // WTF WHY IS THIS HAPPENING!!!
		//------------------------------------------------------------------------------------------------------------------
		// Declarations
		//------------------------------------------------------------------------------------------------------------------
		let active = false;
		let debug = false;
		let cpuMode = cpuManager.getThrottleMode();

		// cpu throttle
		active = cpuManager.getCPUActive(cpuMode);

		//------------------------------------------------------------------------------------------------------------------
		// Do stuffs
		//------------------------------------------------------------------------------------------------------------------
		lib.log("<b>+++++++++++++++++++++++ new tick +++++++++++++++++++++++</b>" , debug);
		cleanupMemory();
		if (active)
		{
			cacheManager.init();
			Room.updateRoomCache();
			motivator.init();
			motivator.motivate();
		}

		//------------------------------------------------------------------------------------------------------------------
		// END
		//------------------------------------------------------------------------------------------------------------------
		lib.log("<b>+++++++++++++++++++++++ end tick +++++++++++++++++++++++</b>" , debug);

		cpuManager.timerStop("loop" , config.cpuLoopDebug , 30 , 38);
		cpuManager.tickTrack();
	//});
};

function cleanupMemory ()
{
	let debug = false;
	_.forEach(Memory.creeps, (m, c) =>
	{
		if (lib.isNull(Game.creeps[c]))
		{
			let mem = Memory.creeps[c];
			if (!lib.isNull(mem))
			{
				lib.log(`Memory cleanup: ${c}`, debug);
				delete Memory.creeps[c];
			}
		}
	});
};



