"use strict";

let Motivation = require("Motivation.prototype")();

let MotivationDefense = function ()
{
	Motivation.call(this);
	this.name = "motivationDefense";
};

MotivationDefense.prototype = Object.create(Motivation.prototype);
MotivationDefense.prototype.constructor = MotivationDefense;

MotivationDefense.prototype.getDesiredSpawnUnit = function (roomName)
{
	let numGuard = Room.countUnits(roomName, "guard");
	let numRangedGuard = Room.countUnits(roomName, "rangedGuard");
	let numHeal = Room.countUnits(roomName, "heal");

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

MotivationDefense.prototype.getAssignableUnitNames = function ()
{
	return ["guard" , "rangedGuard" , "healer"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationDefense.prototype.updateActive = function (roomName)
{
	Memory.rooms[roomName].motivations[this.name].active = true;
	return Memory.rooms[roomName].motivations[this.name].active;
};

MotivationDefense.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let needName, need;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// create new need if one doesn't exist
	needName = "garrison." + room.name;
	if (lib.isNull(memory.needs[needName]) && room.threat.level >= C.THREAT_NPC)
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needGarrison";
		need.priority = C.PRIORITY_1;
		need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
	}
	else
	{
		delete memory.needs[needName];
	}

	// create need for remote rooms
	_.forEach(Room.rHarvestTargets, t =>
	{
		needName = "rgarrison." + room.name;
		let threat = Room.getThreat(t);
		if (lib.isNull(memory.needs[needName]) && threat.level >= C.THREAT_NPC)
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needRGarrison";
			need.targetRoom = t;
			need.priority = C.PRIORITY_2;
			need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
		}
		else
		{
			delete memory.needs[needName];
		}
	});
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationDefense();