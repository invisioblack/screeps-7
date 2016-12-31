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
	let energy = this.room.getSpawnEnergy();

	console.log("  Spawn Status: " + energy.energy + "/" + energy.energyCapacity + " full energy: " + fullEnergy);

	if (fullEnergy)
	{
		return this.spawnUnitByEnergy(unitName , energy.energyCapacity);
	} else {
		return this.spawnUnitByEnergy(unitName, energy.energy);
	}
};

Spawn.prototype.spawnUnitByEnergy = function (unitName, energy)
{
	let parts = [];
	let name = this.generateName(unitName);
	let result;
	let energyLeft = energy;

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
		console.log('-------------------Failed creating creep ' + unitName + ' : ' + name + " energy: " + energy + " result: too little energy");
	else
	{
		result = this.createCreep(parts , name , units[unitName].memory);
		if (_.isString(result))
		{
			console.log('+++++++++++++++++++Creating creep ' + unitName + ' : ' + name + " energy: " + energy + " result: " + result);
			let creep = Game.creeps[name];
			creep.initMotive();
			creep.memory.homeRoom = this.room.name;
			creep.memory.spawn = this.name;
		}
		else
		{
			console.log('-------------------Failed creating creep ' + unitName + ' : ' + name + " energy: " + energy + " result: " + result);
		}
	}
};
module.exports = function() {};