//-------------------------------------------------------------------------
// motivationManualTactical
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Motivation = require("Motivation.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationManualTactical = function ()
{
	Motivation.call(this);
	this.name = "motivationManualTactical";
};

MotivationManualTactical.prototype = Object.create(Motivation.prototype);
MotivationManualTactical.prototype.constructor = MotivationManualTactical;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationManualTactical.prototype.getDemands = function (roomName, resources)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);

	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	// TODO: improve this output, it is in the same in all of them, only shows the first unit demanded
	lib.log('  Manual Tactical Demands: ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationManualTactical.prototype.getDesireSpawn = function (roomName, demands)
{
	return false;
};

MotivationManualTactical.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "guard";
};

MotivationManualTactical.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let flags = _.map(lib.nullProtect(room.memory.cache.flags), (f) => {
		return Game.flags[f];
	});
	//console.log("Room: " + roomName + " " + JSON.stringify(flags));
	let filteredFlags = _.filter(flags, (f) => {
		if (!lib.isNull(f))
			return f.name === "spawn"
				|| f.name === "creep"
				|| f.name === "wall"
				|| f.name === "structure"
				|| f.name === "move";
		else
		{
			return false;
			room.updateFlagCache(true);
		}
	});
	//console.log("Room: " + roomName + " " + JSON.stringify(filteredFlags));

	// mantac must be activated manually, by default in new rooms it will be off
	if(_.size(filteredFlags) > 0)
		memory.active = true;
	else
		memory.active = false;
};

MotivationManualTactical.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// Handle Harvest Energy Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let needName = "mantac." + room.name;
	let need;

	//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]))
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needManualTactical";
		need.priority = C.PRIORITY_1;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationManualTactical();
