//----------------------------------------------------------------------------------------------------------------------
// motivationSupplyController
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');
var needHarvestEnergy = require("needHarvestEnergy");

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
	this.needs["needHarvestEnergy"] = needHarvestEnergy;
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
	result.spawn = resources.units["worker"].allocated < result.units["worker"];
	console.log('  Supply Controller Demands: e: ' + result.energy + ' Workers: ' + result.units["worker"] + ' Spawn: ' + result.spawn);
	return result;
};

MotivationSupplyController.prototype.getDesiredSpawnUnit = function ()
{
	return "worker";
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
	var sortedNeedsByDistance, x;

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

		//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHarvestEnergy";
			need.sourceId = s.id;
			need.targetId = room.controller.id;
			need.distance = room.findPath(s.pos, room.controller.pos).length;
			need.priority = C.PRIORITY_5;
		} else {
			need = memory.needs[needName];
		}
	}, this);

	// prioritize harvesting needs by distance
	sortedNeedsByDistance = _.filter(memory.needs, { "type": "needHarvestEnergy" });
	sortedNeedsByDistance = _.sortByOrder(sortedNeedsByDistance, ['distance'], ['asc']);
	x = 0;
	sortedNeedsByDistance.forEach(function(n) {
		switch (x)
		{
			case 0:
				n.priority = C.PRIORITY_1;
				break;
			case 1:
				n.priority = C.PRIORITY_2;
				break;
			case 2:
				n.priority = C.PRIORITY_3;
				break;
			case 3:
				n.priority = C.PRIORITY_4;
				break;
			default:
				n.priority = C.PRIORITY_5;
				break;
		}
		x++;
	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplyController();