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
MotivationManualTactical.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
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

MotivationManualTactical.prototype.getAssignableUnitNames = function ()
{
	return ["guard", "rangedGuard", "healer"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationManualTactical.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let flagIds = lib.nullProtect(room.memory.cache.flags, []);
	let flags;

	if (flagIds.length === 0)
		return false;

	flags = _.map(flagIds, (f) => {
		return Game.flags[f];
	});

	//console.log("Room: " + roomName + " " + JSON.stringify(flags));
	let filteredFlags = _.filter(flags, (f) => {
		if (!lib.isNull(f))
			return f.name === "spawn"
				|| f.name === "creep"
				|| f.name === "wall"
				|| f.name === "structure"
				|| f.name === "move"
				|| f.name === "move1";
		else
		{
			return false;
			room.updateFlagCache(true);
		}
	});

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

	let needName = "mantac." + room.name;
	let need;


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
