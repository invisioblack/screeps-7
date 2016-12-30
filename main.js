//-------------------------------------------------------------------------
// Main
//-------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------------------------------
// game prototypes
require('Creep.prototype');
require('Source.prototype');
require('Room.prototype');
require('Spawn.prototype');
require('StructureTower.prototype');

const profiler = require('screepsProfiler');
profiler.enable();

// global -------------------------------------------------------------------------------------------------------------
// modules
global.C = require("C");
global.lib = require("lib");
global.jobBuild = require("jobBuild");
global.jobGuard = require("jobGuard");
global.jobHarvestSource = require("jobHarvestSource");
global.jobHeal = require("jobHeal");
global.jobLongDistanceHarvest = require("jobLongDistanceHarvest");
global.jobRangedGuard = require("jobRangedGuard");
global.jobRepair = require("jobRepair");
global.jobTransfer = require("jobTransfer");
global.motivator = require("motivator");
global.motivationGarrison = require("motivationGarrison");
global.motivationHarvestSource = require("motivationHarvestSource");
global.motivationHaulToStorage = require("motivationHaulToStorage");
global.motivationLongDistanceHarvest = require("motivationLongDistanceHarvest");
global.motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
global.motivationSupplyController = require('motivationSupplyController');
global.motivationSupplySpawn = require('motivationSupplySpawn');
global.motivationSupplyTower = require("motivationSupplyTower");
global.needManager = require("needManager");
global.needBuild = require("needBuild");
global.needGarrison = require("needGarrison");
global.needHarvestSource = require("needHarvestSource");
global.needHaulToStorage = require("needHaulToStorage");
global.needLongDistanceHarvest = require("needLongDistanceHarvest");
global.needRepair = require("needRepair");
global.needTransferEnergy = require("needTransferEnergy");
global.roomManager = require("roomManager");
global.units = require("units");

// settings
global.config = require("config");

// main loop -----------------------------------------------------------------------------------------------------------
module.exports.loop = function ()
{
	profiler.wrap(function()
	{
		//------------------------------------------------------------------------------------------------------------------
		// Declarations
		//------------------------------------------------------------------------------------------------------------------
		var active = true;

		//------------------------------------------------------------------------------------------------------------------
		// Do stuffs
		//------------------------------------------------------------------------------------------------------------------
		console.log("<b>+++++++++++++++++++++++ new tick +++++++++++++++++++++++</b>");
		if (active)
		{
			cleanupMemory();
			motivator.init();
			motivator.motivate();
		}

		//------------------------------------------------------------------------------------------------------------------
		// END
		//------------------------------------------------------------------------------------------------------------------
		console.log("<b>+++++++++++++++++++++++ end tick +++++++++++++++++++++++</b>");
	});
};

function cleanupMemory ()
{
    for(var i in Memory.creeps) {
        if(!Game.creeps[i])
            delete Memory.creeps[i];
    }
/*
    for(var i in Memory.rooms) {
        if(!Game.rooms[i])
            delete Memory.rooms[i];
    }
*/
}