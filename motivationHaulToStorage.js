//----------------------------------------------------------------------------------------------------------------------
// motivationHaulToStorage
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
let MotivationHaulToStorage = function ()
{
	Motivation.call(this);
	this.name = "motivationHaulToStorage";
};

MotivationHaulToStorage.prototype = Object.create(Motivation.prototype);
MotivationHaulToStorage.prototype.constructor = MotivationHaulToStorage;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationHaulToStorage.prototype.getDemands = function (roomName, resources) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log("  Haul to Storage Demands: " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHaulToStorage.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "hauler";
};

MotivationHaulToStorage.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numWorkers = strategyManager.countRoomUnits(roomName, "worker");

	if (memory.active)
	{
		for (let unitName in units)
		{
			if ((!lib.isNull(demands.units[unitName]) && demands.units[unitName] <= strategyManager.countRoomUnits(roomName, unitName)) || numWorkers < config.critWorkers)
			{
				result = false;
			}
		}
	} else {
		result = false;
	}

	return result;
};

MotivationHaulToStorage.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let storageIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_STORAGE], []);
	let storages  = _.map(storageIds, (id) => { return Game.getObjectById(id) });

	if (!lib.isNull(room.controller) && room.controller.my && room.controller.level >= 4 && storages.length > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationHaulToStorage.prototype.updateNeeds = function (roomName)
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
	let needName = "haulStorage." + room.name;
	let need;
	let storages = room.memory.cache.structures[STRUCTURE_STORAGE].length;

	// create new need if one doesn't exist
	if (lib.isNull(memory.needs[needName]) && storages.length)
	{
		memory.needs[needName] = {};
		need = memory.needs[needName];
		need.name = needName;
		need.type = "needHaulToStorage";
		need.targetId = room.memory.cache.structures[STRUCTURE_STORAGE][0];
		need.priority = C.PRIORITY_1;
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHaulToStorage();
