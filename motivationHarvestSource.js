//----------------------------------------------------------------------------------------------------------------------
// motivationSupplyController
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var C = require('C');
var lib = require('lib');
var resourceManager = require("resourceManager");
var needHarvestSource = require("needHarvestSource");
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
var MotivationHarvestSource = function ()
{
	Motivation.call(this);
	this.name = "motivationHarvestSource";
	this.needs = {};
	this.needs["needHarvestSource"] = needHarvestSource;
};

MotivationHarvestSource.prototype = Object.create(Motivation.prototype);
MotivationHarvestSource.prototype.constructor = MotivationHarvestSource;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationHarvestSource.prototype.getDemands = function (roomName, resources) {
	var result = {};
	var unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//console.log(JSON.stringify(result));
	console.log("  Harvest Source Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn);
	return result;
};

MotivationHarvestSource.prototype.getDesiredSpawnUnit = function ()
{
	return "harvester";
};

MotivationHarvestSource.prototype.getDesireSpawn = function (roomName, demands)
{
	var result = true;
	//var numContainers = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; }}).length;
	var numHarvesters = resourceManager.countRoomUnits(roomName, "harvester");
	var numWorkers = resourceManager.countRoomUnits(roomName, "worker");

	if (numHarvesters >= demands.units["harvester"] || numWorkers < 2)
	{
		result = false;
	}

	return result;
};

MotivationHarvestSource.prototype.updateActive = function (roomName, demands)
{
	var memory = Game.rooms[roomName].memory.motivations[this.name];
	var numContainers = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; }}).length;
	var numHarvesters = resourceManager.countRoomUnits(roomName, "harvester");
	if (numContainers > 0 && numHarvesters > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationHarvestSource.prototype.updateNeeds = function (roomName)
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
	var sources = room.find(FIND_SOURCES);
	sources.forEach(function (s) {
		var needName = "harvest." + s.id;
		var need;
		var container = s.pos.findInRange(FIND_STRUCTURES, 1,{ filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; }})[0];

		//console.log('Need Name: ' + needName);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]) && !lib.isNull(container))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHarvestSource";
			need.targetId = s.id;
			need.priority = C.PRIORITY_1;
		}

		if (lib.isNull(container))
		{
			delete memory.needs[needName];
		}
	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHarvestSource();