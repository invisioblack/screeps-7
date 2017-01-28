//-------------------------------------------------------------------------
// motivationGarrison
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Motivation = require("Motivation.prototype")();

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationGarrison = function ()
{
	Motivation.call(this);
	this.name = "motivationGarrison";
};

MotivationGarrison.prototype = Object.create(Motivation.prototype);
MotivationGarrison.prototype.constructor = MotivationGarrison;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationGarrison.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName , result);
	lib.log('  Garrison Demands: e: ' + result.energy + ' ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn , debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationGarrison.prototype.getDesireSpawn = function (roomName , demands)
{
	let result = false;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if (room.memory.threat.level >= C.THREAT_PLAYER || (roomManager.getIsLongDistanceHarvestTarget(roomName) && room.memory.threat.level >= C.THREAT_NPC))
	{
		result = true;
	}

	_.forEach(room.memory.longDistanceHarvestTargets , (r) =>
	{
		let numGuards = creepManager.countRoomUnits(r , "guard");
		let threatLevel = Memory.rooms[r].threat.level;

		if (numGuards < 1 && threatLevel >= C.THREAT_NPC)
		{
			result = true;
		}
	});

	return result;
};

MotivationGarrison.prototype.getDesiredSpawnUnit = function (roomName)
{
	let room = Game.rooms[roomName];
	let numGuard = global.cache.rooms[roomName].units["guard"].length;
	let numRangedGuard = global.cache.rooms[roomName].units["rangedGuard"].length;
	let numHeal = global.cache.rooms[roomName].units["heal"].length;

	if (numRangedGuard < numGuard)
	{
		return "rangedGuard";
	}
	else if (numGuard <= numRangedGuard || numGuard <= numHeal)
	{
		return "guard";
	}
	else if (numHeal <= numRangedGuard)
	{
		return "rangedGuard";
	}
};

MotivationGarrison.prototype.getAssignableUnitNames = function ()
{
	return ["guard" , "rangedGuard" , "healer"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationGarrison.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numGuard = global.cache.rooms[roomName].units["guard"].length;
	let numRangedGuard = global.cache.rooms[roomName].units["rangedGuard"].length;
	let numHeal = global.cache.rooms[roomName].units["heal"].length;
	let numCombatUnits = numGuard + numHeal + numRangedGuard;

	//console.log(`Room: ${roomName} ${numCombatUnits}`);

	if (numCombatUnits > 0)
	{
		memory.active = true;
	}
	else
	{
		memory.active = false;
	}
};

MotivationGarrison.prototype.updateNeeds = function (roomName)
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
	let needName = "garrison." + room.name;
	let need;

	//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]))
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needGarrison";
		need.priority = C.PRIORITY_1;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationGarrison();