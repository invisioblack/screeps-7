/**
 * TODO: revamp haul to storage to make hauler smarter, don't use default energy finder
 *      split loads better
 *      manage links
 *      support picking up minerals
 *      support picking up energy from long range harvest rooms
 * TODO: set rooms as defended, and send creeps to kill enemies there
 *      tie this to garrison
 *      set garrison to allow to pull units from elsewhere
 *      create specific spawn profiles based on threat
 * TODO: should be able to set a motivation on a creep and have the need manager auto set a need on it
 *      this wil be used for things like periodically sending units places to do things
 * TODO: Implement labs and making boosts
 * TODO: improve creep design
 *      allow for specify max parts
 *      allow to specify max/for other parts
 *      utilize boosts
 * TODO: create scouts
 * TODO: Implement market
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
 * TODO: implement standard validation on every function
 *      check to make sure every reference exists, and handle at the begenning
 */
"use strict";

//----------------------------------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------------------------------
const profiler = require('screeps-profiler');
profiler.enable();
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
module.exports.loop = function () {
	profiler.wrap(function () {
		cpuManager.timerStart("++++ Loop ++++", "loop");
		delete Memory.rooms[undefined]; // WTF WHY IS THIS HAPPENING!!!
		//------------------------------------------------------------------------------------------------------------------
		// Declarations
		//------------------------------------------------------------------------------------------------------------------
		let active = true;
		let debug = false;
		let cpuMode = cpuManager.getThrottleMode();

		// cpu throttle
		active = cpuManager.getCPUActive(cpuMode);

		//------------------------------------------------------------------------------------------------------------------
		// Do stuffs
		//------------------------------------------------------------------------------------------------------------------
		lib.log("<b>+++++++++++++++++++++++ new tick +++++++++++++++++++++++</b>", debug);
		cleanupMemory();
		if (active) {
			cacheManager.init();
			motivator.init();
			motivator.motivate();
		}
		creepManager.handleLostCreeps();

		//------------------------------------------------------------------------------------------------------------------
		// END
		//------------------------------------------------------------------------------------------------------------------
		lib.log("<b>+++++++++++++++++++++++ end tick +++++++++++++++++++++++</b>", debug);

		if (Game.time % 100 === 0)
			cacheManager.flushMem("cacheFunction");

		cpuManager.timerStop("loop", config.cpuLoopDebug, 30, 38);
		cpuManager.tickTrack();
	});
};

function cleanupMemory() {
	for (let i in Memory.creeps) {
		if (!Game.creeps[i]) {
			let mem = Memory.creeps[i];
			if (!lib.isNull(mem)
				&& !lib.isNull(mem.unit)
				&& !lib.isNull(mem.motive)
				&& !lib.isNull(mem.motive.room)
				&& !lib.isNull(mem.motive.motivation))
				cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("creepManager.countRoomMotivationUnits", [mem.motive.room, mem.motive.motivation, mem.unit]));
			delete Memory.creeps[i];
		}
	}
};



