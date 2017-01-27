//-------------------------------------------------------------------------
// prototype.spawn
//-------------------------------------------------------------------------
"use strict";

// game costs for spawning parts
Spawn.prototype.costs = {};
Spawn.prototype.costs[MOVE] = 50;
Spawn.prototype.costs[WORK] = 100;
Spawn.prototype.costs[CARRY] = 50;
Spawn.prototype.costs[ATTACK] = 80;
Spawn.prototype.costs[RANGED_ATTACK] = 150;
Spawn.prototype.costs[HEAL] = 250;
Spawn.prototype.costs[TOUGH] = 10;
Spawn.prototype.costs[CLAIM] = 600;
Spawn.prototype.rsl = [0,300,550,800,1300,1800,2300,5300,12300];

    // returns cost for an array of parts
Spawn.prototype.getCostParts = function (parts)
{
	let result = 0;
	if (parts.length)
	{
		for (let x in parts)
		{
		    //console.log("P: " + parts[x]);
			result += this.costs[parts[x]];
		}
	}
	return result;
};

// generate a name for a creep
Spawn.prototype.generateName = function (name)
{
	let result = false;
	let x = 1;
	while (!result)
	{
		let found = false;
		let nameTry = name + '-' + x;
		// check for creeps with that name
		for (let i in Game.creeps)
		{
			if (Game.creeps[i].name === nameTry)
			{
				found = true;
			}
		}

		// handle found
		if (!found)
		{
			return nameTry;
		}
		x++;
	}
};

/**
 * public function to spawn units
 * @param unitName
 * @param fullEnergy
 */
Spawn.prototype.spawnUnit = function (unitName, forceRsl = 0)
{
	let debug = true;
	let spawnEnergy = this.room.getSpawnEnergy();
	let energyBudget = 0;
	let numWorkers = creepManager.countRoomUnits(this.room.name, "worker");
	let forceSpawn = false;

	// hijack if forceSpawn is enabled
	if (!lib.isNull(this.room.memory.forceSpawn) && this.room.memory.forceSpawn != "")
	{
		forceSpawn = true;
		unitName = this.room.memory.forceSpawn;
	}

	// panic worker override
	if (numWorkers < config.critWorkers && unitName === "worker")
	{
		energyBudget = spawnEnergy.energy;
	} else {
		energyBudget = spawnEnergy.energyCapacity;
	}

	lib.log(`Spawn Status Room: ${roomLink(this.room.name)} Unit: ${unitName} Energy Availability: ${spawnEnergy.energy}/${spawnEnergy.energyCapacity} Budget: ${energyBudget} FS: ${forceSpawn}`, debug);
	return this.spawnUnitByEnergy(unitName , energyBudget, forceRsl);
};

/**
 * private function to spawn units, generally use spawnUnit
 * @param unitName
 * @param energyBudget
 */
Spawn.prototype.spawnUnitByEnergy = function (unitName, energyBudget, forceRsl = 0)
{
	let debug = true;
	let parts = [];
	let name;
	let result;
	let energyLeft = energyBudget;
	let roomSpawnLevel = this.room.memory.rsl;
	let spawnEnergy = this.room.getSpawnEnergy();
	let partCost = 0;

	// check rsl
	let x = -1;
	_.forEach(this.rsl, (en) =>
	{
		//console.log("en: " + en + " x: " + x);
		if (energyBudget > en)
			x++;
	});
	roomSpawnLevel = x;

	// use forceRsl to override the spawn level, but don't let it over try
	if (forceRsl !== 0)
	{
		if (forceRsl < roomSpawnLevel)
			roomSpawnLevel = forceRsl;
	}

	switch (units[unitName].mode)
	{
		case 1:
			units[unitName].parts.forEach(function (part)
			{

				let partEnergy = energyBudget * part.weight;
				let numberParts = Math.floor(partEnergy / this.costs[part.part]);

				if (numberParts < part.minimum)
					numberParts = part.minimum;
				for (let x = 0; x < numberParts; x++)
				{
					//console.log(energyLeft + "/" + this.costs[part.part]);
					if (energyLeft >= this.costs[part.part])
					{
						parts.push(part.part);
						energyLeft -= this.costs[part.part];
					}
				}
			} , this);
			break;
		case 2:
			parts = units[unitName].parts;
			break;
		case 3:
			parts = units[unitName].parts[roomSpawnLevel];
			break;
	}

	// attempt to spawn creep ------------------------------------------------------------------------------------------
	name = this.generateName(unitName);
	partCost = this.getCostParts(parts);
	lib.log(`Spawn Status Room: ${roomLink(this.room.name)} RSL: ${roomSpawnLevel} Spawning: ${name} Energy Budget: ${energyBudget} Cost: ${partCost} Avail/Max: ${spawnEnergy.energy}/${spawnEnergy.energyCapacity} Parts: ${parts.length}`, debug);
	if (energyBudget < 300)
		lib.log('Spawn Status -- Failed creating creep ' + name + ' : ' + name + " energyBudget: " + energyBudget + " result: too little energyBudget", debug);
	else
	{
		parts = this.shuffle(parts);
		result = this.createCreep(parts , name , units[unitName].memory);
		if (_.isString(result))
		{
			lib.log('Spawn Status ++ Creating creep ' + name + ' : ' + name + " energyBudget: " + energyBudget + " result: " + result, debug);
			// @type {Creep}
			let creep = Game.creeps[name];
			creep.memory.homeRoom = this.room.name;
			creep.memory.spawn = this.name;
			creep.initMotive();
			creep.deassignMotive(this.room.name);
		}
		else
		{
			lib.log('Spawn Status -- Failed creating creep ' + name + ' : ' + name + " energyBudget: " + energyBudget + " result: " + result, debug);
		}
	}
};

Spawn.prototype.shuffle = function(body) {
	if(body === undefined)
		return undefined;
	return _(body)
		.sortBy(function(part) {
			if(part === TOUGH)
				return 0;
			else if(part === HEAL)
				return BODYPARTS_ALL.length;
			else
				return _.random(1,BODYPARTS_ALL.length-1);
		})
		.value();
};

module.exports = function() {};