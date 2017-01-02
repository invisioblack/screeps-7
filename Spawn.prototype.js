//-------------------------------------------------------------------------
// prototype.spawn
//-------------------------------------------------------------------------


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


    // returns cost for an array of parts
Spawn.prototype.getCostParts = function (parts)
{
	let result = 0;
	if (parts.length)
	{
		for (let x in parts)
		{
		    //console.log("P: " + parts[x]);
			result += Spawn.prototype.getCostParts.costs[parts[x]];
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
			if (Game.creeps[i].name == nameTry)
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

Spawn.prototype.spawnUnit = function (unitName, fullEnergy)
{
	let debug = false;
	let energy = this.room.getSpawnEnergy();

	lib.log("  Spawn Status: " + energy.energy + "/" + energy.energyCapacity + " full energy: " + fullEnergy, debug);

	if (fullEnergy)
	{
		return this.spawnUnitByEnergy(unitName , energy.energyCapacity);
	} else {
		return this.spawnUnitByEnergy(unitName, energy.energy);
	}
};

Spawn.prototype.spawnUnitByEnergy = function (unitName, energy)
{
	let debug = false;
	let parts = [];
	let name;
	let result;
	let energyLeft = energy;

	// hijack if forceSpawn is enabled
	if (!lib.isNull(this.room.memory.forceSpawn) && this.room.memory.forceSpawn != "")
	{
		unitName = this.room.memory.forceSpawn;
	}

	name = this.generateName(unitName);

	if (units[unitName].mode == 1)
	{

		units[unitName].parts.forEach(function (part)
		{

			let partEnergy = energy * part.weight;
			let numberParts = Math.floor(partEnergy / this.costs[part.part]);

			if (numberParts < part.minimum)
				numberParts = part.minimum;
			for (x = 0; x < numberParts; x++)
			{
				//console.log(energyLeft + "/" + this.costs[part.part]);
			    if (energyLeft >= this.costs[part.part])
			    {
				    parts.push(part.part);
				    energyLeft -= this.costs[part.part];
			    }
			}
		} , this);
	} else if (units[unitName].mode == 2)
	{
		parts = units[unitName].parts;
	}

	//console.log(JSON.stringify(parts));
	if (energy < 300)
		lib.log('-------------------Failed creating creep ' + unitName + ' : ' + name + " energy: " + energy + " result: too little energy", debug);
	else
	{
		parts = this.shuffle(parts);
		result = this.createCreep(parts , name , units[unitName].memory);
		if (_.isString(result))
		{
			lib.log('+++++++++++++++++++Creating creep ' + unitName + ' : ' + name + " energy: " + energy + " result: " + result, debug);
			let creep = Game.creeps[name];
			creep.initMotive();
			creep.memory.homeRoom = this.room.name;
			creep.memory.spawn = this.name;
		}
		else
		{
			lib.log('-------------------Failed creating creep ' + unitName + ' : ' + name + " energy: " + energy + " result: " + result, debug);
		}
	}
};

Spawn.prototype.shuffle = function(body) {
	if(body == undefined)
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