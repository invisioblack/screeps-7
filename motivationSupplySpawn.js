//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Motivation = require("Motivation.prototype")();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

// TODO: rework this so that there is 2 needs, one for the spawn, one for
// the extenders, then make the movement pattern on filling the extenders
// better, like keep filling till out of evergy instead of resetting

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationSupplySpawn = function ()
{
	Motivation.call(this);
	this.name = "motivationSupplySpawn";
};

MotivationSupplySpawn.prototype = Object.create(Motivation.prototype);
MotivationSupplySpawn.prototype.constructor = MotivationSupplySpawn;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationSupplySpawn.prototype.getDemands = function (roomName, resources)
{
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.energy = resources.spawnEnergy.energyCapacity - resources.spawnEnergy.energy;
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	console.log('  Supply Spawn Demands: e: ' + result.energy + ' ' + unitName + ': ' + result.units[unitName] + ' Spawn: ' + result.spawn);
	return result;
};

MotivationSupplySpawn.prototype.getDesireSpawn = function (roomName, demands)
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

MotivationSupplySpawn.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "worker";
};

MotivationSupplySpawn.prototype.updateActive = function (roomName, demands)
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

MotivationSupplySpawn.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let sortedNeedsByDistance, x;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// spawns ----------------------------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	for (let spawnName in Game.spawns)
	{
		// loop over spawns in room
		let spawn = Game.spawns[spawnName];
		if (spawn.room.name == roomName)
		{
			let needName = "supplySpawn." + spawn.id;
			let need;

			//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

			// create needs if we need energy, cull needs if not
			if ((spawn.energyCapacity - spawn.energy) > 0)
			{
				// create new need if one doesn't exist
				if (lib.isNull(memory.needs[needName]))
				{
					memory.needs[needName] = {};
					need = memory.needs[needName];
					need.type = "needTransferEnergy";
					need.name = needName;
					need.targetId = spawn.id;
					need.priority = C.PRIORITY_2;
				}
			} else { // cull need if we don't need energy
				delete memory.needs[needName];
			}
		}
	}

	// extenders -------------------------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	let extenders = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
	extenders.forEach(function (ex) {
		let needName = "supplyExtender." + ex.id;
		let need;

		//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

		if ((ex.energyCapacity - ex.energy) > 0)
		{
			// create new need if one doesn't exist
			if (lib.isNull(memory.needs[needName]))
			{
				memory.needs[needName] = {};
				need = memory.needs[needName];
				need.type = "needTransferEnergy";
				need.name = needName;
				need.targetId = ex.id;
				need.priority = C.PRIORITY_1;
			}
		} else { // cull need if we don't need energy
			delete memory.needs[needName];
		}
	}, this);

	delete memory.needs["harvest.5836b7268b8b9619519efeba.5859ec4ea7dab3591e5a0ed3"];

};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationSupplySpawn();