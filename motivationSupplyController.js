//----------------------------------------------------------------------------------------------------------------------
// motivationSupplyController
//-------------------------------------------------------------------------

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
MotivationSupplyController.prototype.getDemands = function (roomName, resources) {
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.energy = resources.controllerStatus.progressTotal - resources.controllerStatus.progress;
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	console.log('  Supply Controller Demands: e: ' + result.energy + " " + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn);
	return result;
};

MotivationSupplyController.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "worker";
};

MotivationSupplyController.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (memory.active)
	{
		for (let unitName in units)
		{
			if (!lib.isNull(demands.units[unitName]) && demands.units[unitName] <= room.countUnits(unitName))
			{
				result = false;
			}
		}
	} else {
		result = false;
	}

	return result;
};

MotivationSupplyController.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (room.controller.my && demands.energy > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
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

	// Handle Harvest Energy Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let needName = "supplyController." + room.controller.id;
	let need;

	//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

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