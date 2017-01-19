//----------------------------------------------------------------------------------------------------------------------
// motivationLongDistanceHarvest
//-------------------------------------------------------------------------
"use strict";
let Motivation = require('Motivation.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationLongDistanceHarvest = function ()
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
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//console.log(JSON.stringify(result.units));
	lib.log("  Long Distance Harvest Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationLongDistanceHarvest.prototype.getDesiredSpawnUnit = function ()
{
	return "ldharvester";
};

MotivationLongDistanceHarvest.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = false;
	let spawnRoom = Game.rooms[roomName];
	let numWorkers = _.has(global, "cache.rooms." + roomName + ".units.worker") ? global.cache.rooms[roomName].units["worker"].length : 0;

	if (numWorkers >= config.critWorkers)
	{
		_.forEach(spawnRoom.memory.longDistanceHarvestTargets, (rN) => {
			let roomMemory = Memory.rooms[rN];
			if (roomMemory.motivations["motivationHarvestSource"].demands.spawn)
				result = true;
		});
	}

	return result;
};

MotivationLongDistanceHarvest.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if (room.getIsMine() && room.memory.longDistanceHarvestTargets.length > 0)
		memory.active = true;
	else
		memory.active = false;
};

MotivationLongDistanceHarvest.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	// insure memory is initialized for needs
	memory.needs = {};

	_.forEach(room.memory.longDistanceHarvestTargets, (rN) => {
		let needName = "ldh." + rN;
		let need;
		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needLongDistanceHarvest";
			need.targetRoom = rN;
			need.priority = C.PRIORITY_1;
		} else {
			need = memory.needs[needName];
		}
	});

};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationLongDistanceHarvest();