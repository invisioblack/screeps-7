//-------------------------------------------------------------------------
// Main
//-------------------------------------------------------------------------

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
//          should be ablt to track one tick or constant
//          major levels
// TODO: create motivation to spawn units for other rooms, rewire claim to use this
// TODO: should be able to set a motivaion on a creep and have the need manager auto set a need on it
//          this wil be used for things like periodically sending units places to do things
// TODO: create linked room manager for console
//          creep details and manager
//          storage details
//          memmory details
//          motivator details
// TODO: create data reporting system
//          collect data, store it in Memory.reporting
//          allow turing entire system on and off
//          use this to pull and track historical data
//          store data by tick, auto cull old data

//----------------------------------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------------------------------
// game prototypes
require('Creep.prototype');
require('Source.prototype');
require('Room.prototype');
require('Spawn.prototype');
require('StructureTower.prototype');

require("logging");

const profiler = require('screepsProfiler');
profiler.enable();

// global -------------------------------------------------------------------------------------------------------------
// modules
global.C = require("C");
global.lib = require("lib");
global.jobBuild = require("jobBuild");
global.jobClaim = require("jobClaim");
global.jobGuard = require("jobGuard");
global.jobHarvestSource = require("jobHarvestSource");
global.jobHeal = require("jobHeal");
global.jobLongDistanceHarvest = require("jobLongDistanceHarvest");
global.jobManualTactical = require("jobManualTactical");
global.jobRangedGuard = require("jobRangedGuard");
global.jobRepair = require("jobRepair");
global.jobSupplyExtenders = require("jobSupplyExtenders");
global.jobTransfer = require("jobTransfer");
global.motivator = require("motivator");
global.motivationClaimRoom = require("motivationClaimRoom");
global.motivationGarrison = require("motivationGarrison");
global.motivationHarvestSource = require("motivationHarvestSource");
global.motivationHaulToStorage = require("motivationHaulToStorage");
global.motivationLongDistanceHarvest = require("motivationLongDistanceHarvest");
global.motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
global.motivationManualTactical = require("motivationManualTactical");
global.motivationSupplyController = require('motivationSupplyController');
global.motivationSupplySpawn = require('motivationSupplySpawn');
global.motivationSupplyTower = require("motivationSupplyTower");
global.needManager = require("needManager");
global.needBuild = require("needBuild");
global.needClaim = require("needClaim");
global.needGarrison = require("needGarrison");
global.needHarvestSource = require("needHarvestSource");
global.needHaulToStorage = require("needHaulToStorage");
global.needLongDistanceHarvest = require("needLongDistanceHarvest");
global.needManualTactical = require("needManualTactical");
global.needRepair = require("needRepair");
global.needSupplyExtenders = require("needSupplyExtenders");
global.needTransferEnergy = require("needTransferEnergy");
global.roomManager = require("roomManager");
global.strategyManager = require("strategyManager");
global.units = require("units");

// settings
global.config = require("config");

// constants
global.RAMPART_UPKEEP	= RAMPART_DECAY_AMOUNT / REPAIR_POWER / RAMPART_DECAY_TIME;
global.ROAD_UPKEEP		= ROAD_DECAY_AMOUNT / REPAIR_POWER /  ROAD_DECAY_TIME;
global.CONTAINER_UPKEEP = CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME_OWNED;
global.REMOTE_CONTAINER_UPKEEP = CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME;

// main loop -----------------------------------------------------------------------------------------------------------
module.exports.loop = function ()
{
	profiler.wrap(function()
	{
		require("shortcuts");
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
			motivator.init();
			motivator.motivate();
		}

		//------------------------------------------------------------------------------------------------------------------
		// END
		//------------------------------------------------------------------------------------------------------------------

		lib.log("<b>+++++++++++++++++++++++ end tick +++++++++++++++++++++++</b>", debug);
		lib.log(`Used CPU: ${Game.cpu.getUsed()}/${Game.cpu.limit} Bucket: ${(Game.cpu.getUsed()-Game.cpu.limit)*-1}/${Game.cpu.bucket}`, config.cpuDebug);
		
	});
};

function cleanupMemory ()
{
    for(let i in Memory.creeps) {
        if(!Game.creeps[i])
            delete Memory.creeps[i];
    }

    /*
    for(let i in Memory.rooms) {
        if(!Game.rooms[i])
            delete Memory.rooms[i];
    }
*/
}
