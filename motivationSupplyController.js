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
	this.priority = C.PRIORITY_2;
};

MotivationSupplyController.prototype = Object.create(Motivation.prototype);
MotivationSupplyController.prototype.constructor = MotivationSupplyController;

MotivationSupplyController.prototype.getDemands = function (roomName, collectorStatus, workers)
{
	var result = {};
	result.energy = collectorStatus.progressTotal - collectorStatus.progress;
	result.workers = Math.floor(result.energy / 50);
	result.spawn = workers < result.workers;

	return result;
}

module.exports = new MotivationSupplyController();