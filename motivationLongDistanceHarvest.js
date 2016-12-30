//----------------------------------------------------------------------------------------------------------------------
// motivationLongDistanceHarvest
//-------------------------------------------------------------------------
var Motivation = require('Motivation.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
var MotivationLongDistanceHarvest = function ()
{
	Motivation.call(this);
	this.name = "motivationLongDistanceHarvest";
};

MotivationLongDistanceHarvest.prototype = Object.create(Motivation.prototype);
MotivationLongDistanceHarvest.prototype.constructor = MotivationLongDistanceHarvest;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationLongDistanceHarvest.prototype.getDemands = function (roomName, resources) {
	var result = {};
	var unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//console.log(JSON.stringify(result.units));
	lib.log("  Long Distance Harvest Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, true);
	return result;
};

MotivationLongDistanceHarvest.prototype.getDesiredSpawnUnit = function ()
{
	return "worker";
};

MotivationLongDistanceHarvest.prototype.getDesireSpawn = function (roomName, demands)
{
	return false;
};

MotivationLongDistanceHarvest.prototype.updateActive = function (roomName, demands)
{
	var room = Game.rooms[roomName];
	var memory = room.memory.motivations[this.name];

	if (room.controller.my)
		memory.active = false;
	else
		memory.active = true;
};

MotivationLongDistanceHarvest.prototype.updateNeeds = function (roomName)
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
		var needName = "ldharvest." + s.id;
		var need;

		//console.log('Need Name: ' + needName);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needLongDistanceHarvest";
			need.targetId = s.id;
			need.priority = C.PRIORITY_1;
		}

	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationLongDistanceHarvest();