//-------------------------------------------------------------------------
// motivationSupplyTower
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
let MotivationSupplyTower = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplyTower";
};

MotivationSupplyTower.prototype = Object.create(Motivation.prototype);
MotivationSupplyTower.prototype.constructor = MotivationSupplyTower;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationSupplyTower.prototype.getDemands = function (roomName, resources)
{
	let debug = false;
	let room = Game.rooms[roomName];
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	let towerIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_TOWER], []);
	let towers = _.map(towerIds, (o) => { return Game.getObjectById(o)});

	let energy = _.sum(towers, "energy");
	let energyTotal = _.sum(towers, "energyCapacity");
	//console.log("e: " + energy + " et: " + energyTotal);
	result.energy = energyTotal - energy;
	result.units = this.getUnitDemands(roomName);
	if (lib.isNull(result.units["worker"]))
		result.units["worker"] = 0;
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log('  Supply Tower Demands: e: ' + result.energy + ' ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationSupplyTower.prototype.getDesireSpawn = function (roomName, demands)
{
	let result = true;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let numWorkers = _.has(global, "cache.rooms." + roomName + ".units.worker") ? global.cache.rooms[roomName].units["worker"].length : 0;
	let numHaulers = _.has(global, "cache.rooms." + roomName + ".units.hauler") ? global.cache.rooms[roomName].units["hauler"].length : 0;

	if (memory.active)
	{
		for (let unitName in units)
		{
			let numUnits = _.has(global, "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName].length : 0;
			if (!lib.isNull(demands.units[unitName]) && demands.units[unitName] <= numUnits)
			{
				result = false;
			}
		}
	} else {
		result = false;
	}

	if (this.getDesiredSpawnUnit(roomName) === "worker" && numWorkers >= config.maxWorkers)
		result = false;
	if (this.getDesiredSpawnUnit(roomName) === "hauler" && numHaulers >= config.maxHaulers)
		result = false;

	return result;
};

MotivationSupplyTower.prototype.getDesiredSpawnUnit = function (roomName)
{
	let energyPickupMode = lib.nullProtect(Memory.rooms[roomName].energyPickupMode, C.ROOM_ENERGYPICKUPMODE_NOENERGY);
	let numWorkers = _.has(global, "cache.rooms." + roomName + ".units.worker") ? global.cache.rooms[roomName].units["worker"].length : 0;

	//console.log(config.critWorkers);


	if (energyPickupMode < C.ROOM_ENERGYPICKUPMODE_CONTAINER || numWorkers <= config.critWorkers)
		return "worker";
	else
		return "hauler";
};

MotivationSupplyTower.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	if (room.getIsMine() && demands.energy > 0)
	{
		memory.active = true;
	} else {
		memory.active = false;
	}
};

MotivationSupplyTower.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let towerIds = lib.nullProtect(room.memory.cache.structures[STRUCTURE_TOWER], []);
	let towers = _.map(towerIds, (o) => { return Game.getObjectById(o)});

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// towers ----------------------------------------------------------------------------------------------------------

	towers.forEach(function (tower){
		//console.log(towers);
		// loop over spawns in room
		if (tower.room.name === roomName)
		{
			let needName = "supplyTower." + tower.id;
			let need;

			//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

			// create needs if we need energy, cull needs if not
			if ((tower.energyCapacity - tower.energy) > 0)
			{
				// create new need if one doesn't exist
				if (lib.isNull(memory.needs[needName]))
				{
					memory.needs[needName] = {};
					need = memory.needs[needName];
					need.type = "needTransferEnergy";
					need.name = needName;
					need.targetId = tower.id;
					need.priority = C.PRIORITY_2;
				}
			} else { // cull need if we don't need energy
				delete memory.needs[needName];
			}
		}
	}, this);
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplyTower();