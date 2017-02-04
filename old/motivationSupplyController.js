//----------------------------------------------------------------------------------------------------------------------
// motivationSupplyController
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
let MotivationSupplyController = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplyController";
};

MotivationSupplyController.prototype = Object.create(Motivation.prototype);
MotivationSupplyController.prototype.constructor = MotivationSupplyController;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationSupplyController.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName , result);
	lib.log('  Supply Controller Demands: e: ' + result.energy + " " + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn , debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationSupplyController.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "worker";
};

MotivationSupplyController.prototype.getDesireSpawn = function (roomName , demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numWorkers = Room.countMotivationUnits(roomName , this.name , "worker");
	let numRoomWorkers = Room.countHomeRoomUnits(roomName , this.name , "worker");


	if (!memory.active || lib.isNull(demands.units["worker"]) || demands.units["worker"] <= numWorkers || numRoomWorkers >= config.unit.max.worker)
	{
		result = false;
	}

	return result;
};

MotivationSupplyController.prototype.getAssignableUnitNames = function ()
{
	return ["worker"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationSupplyController.prototype.updateActive = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (room.isMine)
	{
		memory.active = true;
	}
	else
	{
		memory.active = false;
		memory.demands.spawn = false;
		memory.spawnAllocated = false;
	}
};

MotivationSupplyController.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	let needName = "supplyController." + room.name;
	let need;

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]))
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needTransferEnergy";
		need.targetId = room.controller.id;
		need.priority = C.PRIORITY_1;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplyController();