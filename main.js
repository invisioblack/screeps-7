//-------------------------------------------------------------------------
// Main
//-------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------------------------------
// game prototypes
require('Creep.prototype')();
require('Source.prototype')();
require('Room.prototype')();
require('Spawn.prototype')();
require('StructureTower.prototype')();

const profiler = require('screepsProfiler');
profiler.enable();

// global -------------------------------------------------------------------------------------------------------------
// modules
global.C = require("C");
global.lib = require("lib");
global.defenseManager = require("defenseManager");
global.jobBuild = require("jobBuild");
global.jobHarvestSource = require("jobHarvestSource");
global.jobLongDistanceHarvest = require("jobLongDistanceHarvest");
global.jobRepair = require("jobRepair");
global.jobTransfer = require("jobTransfer");
global.motivator = require("motivator");
global.motivationHarvestSource = require("motivationHarvestSource");
global.motivationLongDistanceHarvest = require("motivationLongDistanceHarvest");
global.motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
global.motivationSupplyController = require('motivationSupplyController');
global.motivationSupplySpawn = require('motivationSupplySpawn');
global.motivationSupplyTower = require("motivationSupplyTower");
global.needManager = require("needManager");
global.needBuild = require("needBuild");
global.needHarvestSource = require("needHarvestSource");
global.needLongDistanceHarvest = require("needLongDistanceHarvest");
global.needRepair = require("needRepair");
global.needTransferEnergy = require("needTransferEnergy");
global.roomManager = require("roomManager");
global.units = require("units");

// settings
global.settings = {};
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