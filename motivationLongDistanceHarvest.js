//----------------------------------------------------------------------------------------------------------------------
// motivationLongDistanceHarvest
//-------------------------------------------------------------------------
"use strict";
let Motivation = require('Motivation.prototype')();

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
MotivationLongDistanceHarvest.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName , result);
	lib.log("Room: " + roomName + "  Long Distance Harvest Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn , debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationLongDistanceHarvest.prototype.getDesiredSpawnUnit = function ()
{
	return "ldharvester";
};

MotivationLongDistanceHarvest.prototype.getDesireSpawn = function (roomName , demands)
{
	let debug = false;
	let result = false;
	let spawnRoom = Game.rooms[roomName];

	_.forEach(spawnRoom.memory.longDistanceHarvestTargets , (rN) =>
	{
		let room = Game.rooms[rN];
		let roomMemory = Memory.rooms[rN];
		if (!lib.isNull(roomMemory) && !lib.isNull(roomMemory.motivations) && !lib.isNull(roomMemory.motivations["motivationHarvestSource"]) && !lib.isNull(roomMemory.motivations["motivationHarvestSource"].demands))
		{
			// TODO: does this really need to happen?
			if (lib.isNull(room))
			{
				roomMemory.motivations["motivationHarvestSource"].demands = motivationHarvestSource.getDemands(rN);
			}

			if (!lib.isNull(roomMemory) && roomMemory.motivations["motivationHarvestSource"].demands.spawn)
			{
				result = true;
			}
			if (!lib.isNull(roomMemory))
			{
				lib.log(`Room: ${roomLink(roomName)} Target: ${roomLink(rN)} Result: ${result} ${JSON.stringify(roomMemory.motivations["motivationHarvestSource"].demands)}` , debug);
			}
		}
	});

	return result;
};

MotivationLongDistanceHarvest.prototype.getAssignableUnitNames = function ()
{
	return ["ldharvester", "worker"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationLongDistanceHarvest.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if (room.getIsMine() && room.memory.longDistanceHarvestTargets.length > 0)
	{
		if (room.memory.mode >= C.ROOM_MODE_NORMAL)
			memory.active = true;
		else
			memory.active = false;
	}
	else
	{
		memory.active = false;
	}
};

MotivationLongDistanceHarvest.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	_.forEach(room.memory.longDistanceHarvestTargets , (rN) =>
	{
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
		}
	});

	_.forEach(memory.needs , (v , k) =>
	{
		if (!_.some(room.memory.longDistanceHarvestTargets , (o) =>
			{
				return v.targetRoom === o;
			}))
		{
			delete memory.needs[k];
		}
	});
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationLongDistanceHarvest();
