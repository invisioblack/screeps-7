//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');

// script prototypes
var Motivation = require('prototype.motivation')();
require('prototype.source')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
var MotivationSupplyController = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplyController";
};

MotivationSupplyController.prototype = Object.create(Motivation.prototype);
MotivationSupplyController.prototype.constructor = MotivationSupplyController;

MotivationSupplyController.prototype.getDemands = function (roomName, resources, collectorStatus) {
	var result = {};
	result.energy = collectorStatus.progressTotal - collectorStatus.progress;
	result.workers = Math.floor(result.energy / 50);
	result.spawn = resources.units["worker"].total < result.workers;

	return result;
};

Motivation.prototype.updateNeeds = function (roomName)
{
	var room = Game.rooms[roomName];
	var memory = room.memory.motivations[this.name];

	// insure memory is initalized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// look up sources and find out how many needs we should have for each one
	var sources = room.find(FIND_SOURCES);
	sources.forEach(function (s) {
		var source = Game.getObjectById(s.id);
		console.log('Source: ' + s.id + ' Max Harvesters: ' + source.getMaxHarvesters());
	}, this);
};

module.exports = new MotivationSupplyController();