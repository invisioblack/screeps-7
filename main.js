/***********************************************************************************************************************
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

/***********************************************************************************************************************
 * profiler
 */
const profiler = require('screeps-profiler');
profiler.enable();

/***********************************************************************************************************************
 * game prototypes
 */
require('Creep.prototype');
profiler.registerClass(Creep , 'Creep');
require('Source.prototype');
profiler.registerClass(Source , 'Source');
require('Room.prototype');
profiler.registerClass(Room , 'Room');
require('RoomPosition.prototype');
profiler.registerClass(RoomPosition , 'RoomPosition');
require('Spawn.prototype');
profiler.registerClass(Spawn , 'Spawn');
require('StructureTower.prototype');
profiler.registerClass(StructureTower , 'StructureTower');
require('StructureLink.prototype');
profiler.registerClass(StructureLink , 'StructureLink');

require("globals");
require("logging");
require("shortcuts");

// global start --------------------------------------------------------------------------------------------------------
cpuManager.log(`>>>> Global Start : ${Game.time} <<<<`);

// main loop -----------------------------------------------------------------------------------------------------------
module.exports.loop = function ()
{
	profiler.wrap(function ()
	{
		cpuManager.timerStart("++++ Loop ++++" , "loop");
		delete Memory.rooms[undefined]; // WTF WHY IS THIS HAPPENING!!!

		let active = false;
		let cpuMode = cpuManager.getThrottleMode();

		// cpu throttle
		active = cpuManager.getCPUActive(cpuMode);

		//--------------------------------------------------------------------------------------------------------------
		// Do stuffs
		cleanupMemory();
		if (active)
		{
			cacheManager.init();
			motivator.init();
			motivator.motivate();
		}

		//--------------------------------------------------------------------------------------------------------------
		// END
		cpuManager.timerStop("loop" , config.cpuLoopDebug , 40 , 45);
		cpuManager.tickTrack();
	});
};

/**
 * Deletes memory for creeps that do not exist.
 */
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



