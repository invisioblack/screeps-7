//----------------------------------------------------------------------------------------------------------------------
// motivationSupplyController
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var C = require('C');
var lib = require('lib');
var resourceManager = require("resourceManager");
var needTransferEnergy = require("needTransferEnergy");
var units = require("units");

// script prototypes
var Motivation = require('prototype.motivation')();
require('prototype.source')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
var MotivationSupplyController = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplyController";
	this.needs = {};
	this.needs["needTransferEnergy"] = needTransferEnergy;
};

MotivationSupplyController.prototype = Object.create(Motivation.prototype);
MotivationSupplyController.prototype.constructor = MotivationSupplyController;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationSupplyController.prototype.getDemands = function (roomName, resources) {
	var result = {};
	result.energy = resources.controllerStatus.progressTotal - resources.controllerStatus.progress;
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	console.log('  Supply Controller Demands: e: ' + result.energy + ' Workers: ' + result.units["worker"] + ' Spawn: ' + result.spawn);
	return result;
};

MotivationSupplyController.prototype.getDesiredSpawnUnit = function ()
{
	return "worker";
};

MotivationSupplyController.prototype.getDesireSpawn = function (roomName, demands)
{
	var result = true;
	var memory = Game.rooms[roomName].memory.motivations[this.name];
	if (memory.active)
	{
		for (var unitName in units)
		{
			if (!lib.isNull(demands.units[unitName]) && demands.units[unitName] < resourceManager.countRoomUnits(roomName , unitName))
			{
				result = false;
			}
		}
	} else {
		result = false;
	}

	return result;
};

MotivationSupplyController.prototype.updateActive = function (roomName, demands)
{
	var memory = Game.rooms[roomName].memory.motivations[this.name];
	if (demands.energy > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationSupplyController.prototype.updateNeeds = function (roomName)
{
	var room = Game.rooms[roomName];
	var memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// Handle Harvest Energy Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	var needName = "supplyController." + room.controller.id;
	var need;

	//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]))
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needTransferEnergy";
		need.targetId = room.controller.id;
		need.priority = C.PRIORITY_5;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplyController();