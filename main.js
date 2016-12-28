//-------------------------------------------------------------------------
// Main
//-------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------------------------------
// game prototypes
require('Creep.prototype')();
require('Source.prototype')();
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
	global.jobRepair = require("jobRepair");
	global.jobTransfer = require("jobTransfer");
	global.motivator = require("motivator");
	global.motivationSupplySpawn = require('motivationSupplySpawn');
	global.motivationSupplyController = require('motivationSupplyController');
	global.motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
	global.motivationHarvestSource = require("motivationHarvestSource");
	global.motivationSupplyTower = require("motivationSupplyTower");
	global.needManager = require("needManager");
	global.needBuild = require("needBuild");
	global.needHarvestSource = require("needHarvestSource");
	global.needRepair = require("needRepair");
	global.needTransferEnergy = require("needTransferEnergy");
	global.resourceManager = require("resourceManager");
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
			global.motivator.init();
			global.motivator.motivate();
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

    for(var i in Memory.rooms) {
        if(!Game.rooms[i])
            delete Memory.rooms[i];
    }
}