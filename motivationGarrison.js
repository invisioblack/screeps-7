//-------------------------------------------------------------------------
// motivationGarrison
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
MotivationGarrison.prototype.getDemands = function (roomName, resources)
{
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	let towers = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_TOWER}});

	let energy = 0;
	let energyTotal = 0;
	//console.log("e: " + energy + " et: " + energyTotal);
	result.energy = energyTotal - energy;
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	console.log('  Garrison Demands: e: ' + result.energy + ' ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn);
	return result;
};

MotivationGarrison.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (!memory.active)
		result = false;

	return result;
};

MotivationGarrison.prototype.getDesiredSpawnUnit = function (roomName)
{
	let room = Game.rooms[roomName];
	let numGuard = room.countUnits("guard");
	let numRangedGuard = room.countUnits("rangedGuard");
	let numHeal = room.countUnits("heal");

	if (numRangedGuard < numGuard)
		return "rangedGuard";
	else if (numGuard <= numRangedGuard || numGuard <= numHeal)
		return "guard";
	else if (numHeal < numRangedGuard)
		return "rangedGuard";
};

MotivationGarrison.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (room.controller.my && room.memory.threat.count > 0)
	{
		memory.active = true;
	} else {
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