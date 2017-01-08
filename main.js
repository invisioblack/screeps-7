global.cpuUsedLast = 0;
/**
 *
// TODO: figure out links
// TODO: set rooms as defended, and send creeps to kill enemies there
//          tie this to garrison
//          set garrison to allow to pull units from elsewhere
//          create specific spawn profiles based on threat
// TODO: improve long range harvest memory data, specify rooms to send havesters from
// TODO: send maintainers to maintain roads in ldh rooms
// TODO: create ally exemption
// TODO: create scout motivation
// TODO: create INFINITE demand profile for some things
// TODO: cache important structures lookup? profile more - fix cpu
// TODO: fix get energy, so we don't go to places when there is energy in better places
// TODO: create CPU monitor
//          Bar graph of CPU and bucket using percent from showLevels()
//          should be able to track one tick or constant
//          major levels
// TODO: create motivation to spawn units for other rooms, rewire claim to use this
// TODO: should be able to set a motivation on a creep and have the need manager auto set a need on it
//          this wil be used for things like periodically sending units places to do things
// TODO: create linked room manager for console
//          creep details and manager
//          storage details
//          memory details
//          motivator details
// TODO: create data reporting system
//          collect data, store it in Memory.reporting
//          allow turing entire system on and off
//          use this to pull and track historical data
//          store data by tick, auto cull old data
// TODO: improve creep design
//          allow for specify max parts
//          allow to specify max/for other parts
 * TODO: fix energy collection, creeps seem to make idiotic choices about where to get their energy
 */

//----------------------------------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------------------------------
// game prototypes
require('Creep.prototype');
require('Source.prototype');
require('Room.prototype');
require('RoomPosition.prototype');
require('Spawn.prototype');
require('StructureTower.prototype');

const profiler = require('screepsProfiler');
profiler.enable();

require("globals");

// global -------------------------------------------------------------------------------------------------------------
// modules

// main loop -----------------------------------------------------------------------------------------------------------
module.exports.loop = function ()
{
	profiler.wrap(function()
	{
		require("logging");
		require("shortcuts");
		global.cpuUsedLast = 0;
		cpuManager.cpuLog("++++ Loop Start");
		//------------------------------------------------------------------------------------------------------------------
		// Declarations
		//------------------------------------------------------------------------------------------------------------------
		let active = true;
		let debug = false;

		//------------------------------------------------------------------------------------------------------------------
		// Do stuffs
		//------------------------------------------------------------------------------------------------------------------
		lib.log("<b>+++++++++++++++++++++++ new tick +++++++++++++++++++++++</b>", debug);
		if (active)
		{
			cleanupMemory();
			cacheManager.init();
			motivator.init();
			motivator.motivate();
		}

		//------------------------------------------------------------------------------------------------------------------
		// END
		//------------------------------------------------------------------------------------------------------------------
		cpuManager.cpuLog("Loop End");
		lib.log("<b>+++++++++++++++++++++++ end tick +++++++++++++++++++++++</b>", debug);
		cpuManager.tickTrack();
		
	});
};

function cleanupMemory ()
{
    for(let i in Memory.creeps) {
        if(!Game.creeps[i])
        {
        	let mem = Memory.creeps[i];
	        cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [mem.motive.room, mem.motive.motivation, mem.unit]));
	        delete Memory.creeps[i];
        }
    }

    /*
    for(let i in Memory.rooms) {
        if(!Game.rooms[i])
            delete Memory.rooms[i];
    }
*/
}
