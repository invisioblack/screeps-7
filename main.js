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


//Game.rooms["W13S77"].memory.motivations["motivationSupplySpawn"].needs["supplyExtenders.W13S77"].type = "needSupplyExtenders";
//Game.rooms["W13S77"].memory.motivations["motivationSupplySpawn"].needs["supplyExtenders.W13S77"].name = "supplyExtenders.W13S77";
//Game.rooms["W12S76"].memory.motivations["motivationSupplySpawn"].needs["supplyExtenders.W12S76"].type = "needSupplyExtenders";
//Game.rooms["W12S76"].memory.motivations["motivationSupplySpawn"].needs["supplyExtenders.W12S76"].name = "supplyExtenders.W12S76";

global.roomCreep = function(creepName, roomName)
{
	Game.creeps[creepName].memory.homeRoom = roomName;
	Game.creeps[creepName].memory.motive.room = roomName;
	Game.creeps[creepName].memory.motive.motivation = "";
	Game.creeps[creepName].memory.motive.need = "";
};

global.lrh = function(creepName, roomName)
{
	Game.creeps[creepName].memory.motive.room = roomName;
	Game.creeps[creepName].memory.motive.motivation = "";
	Game.creeps[creepName].memory.motive.need = "";
};

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
		let active = true;

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