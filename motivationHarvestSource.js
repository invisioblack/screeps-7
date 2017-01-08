//----------------------------------------------------------------------------------------------------------------------
// motivationSupplyController
//-------------------------------------------------------------------------
let Motivation = require('Motivation.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationHarvestSource = function ()
{
	Motivation.call(this);
	this.name = "motivationHarvestSource";
};

MotivationHarvestSource.prototype = Object.create(Motivation.prototype);
MotivationHarvestSource.prototype.constructor = MotivationHarvestSource;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationHarvestSource.prototype.getDemands = function (roomName, resources) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//console.log(JSON.stringify(result.units));
	lib.log("  Harvest Source Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationHarvestSource.prototype.getDesiredSpawnUnit = function ()
{
	return "harvester";
};

MotivationHarvestSource.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let numContainers = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; }}).length;
	let numHarvesters = strategyManager.countRoomUnits(roomName, "harvester");
	let numWorkers = strategyManager.countRoomUnits(roomName, "worker");

	if (numContainers == 0 || numHarvesters >= demands.units["harvester"] || numWorkers < config.critWorkers)
	{
		result = false;
	}

	return result;
};

MotivationHarvestSource.prototype.updateActive = function (roomName, demands)
{

	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numContainers;
	let numHarvesters;

	if (!lib.isNull(room.controller) && room.controller.my)
	{
		numContainers = room.find(FIND_STRUCTURES , {
			filter: function (s)
			{
				return s.structureType == STRUCTURE_CONTAINER;
			}
		}).length;
		numHarvesters = strategyManager.countRoomUnits(roomName, "harvester");
	}

	if (!lib.isNull(room.controller) && room.controller.my && numContainers > 0 && numHarvesters > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationHarvestSource.prototype.updateNeeds = function (roomName)
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
	let sources = room.find(FIND_SOURCES);
	sources.forEach(function (s) {
		let needName = "harvest." + s.id;
		let need;
		let container = s.pos.findInRange(FIND_STRUCTURES, 1,{ filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; }})[0];

		//console.log('Need Name: ' + needName);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]) && !lib.isNull(container))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needHarvestSource";
			need.targetId = s.id;
			need.priority = C.PRIORITY_1;
		}

		if (lib.isNull(container))
		{
			delete memory.needs[needName];
		}
	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationHarvestSource();