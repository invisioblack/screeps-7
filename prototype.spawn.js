//-------------------------------------------------------------------------
// prototype.spawn
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var resourceManager = require("resourceManager");
var units = require("units");
//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = function() 
{
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
		var result = 0;
		if (parts.length)
		{
			for (var x in parts)
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
		var result = false;
		var x = 1;
		while (!result)
		{
			var found = false;
			var nameTry = name + '-' + x;
			// check for creeps with that name
			for (var i in Game.creeps)
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
		var energy = resourceManager.getRoomSpawnEnergy(this.room.name);

		if (fullEnergy)
		{
			if (energy.energy == energy.energyCapacity)
			{
				return this.spawnUnitByEnergy(unitName, energy.energy);
			} else {
				return false;
			}

		} else {
			return this.spawnUnitByEnergy(unitName, energy.energy);
		}
	};

	Spawn.prototype.spawnUnitByEnergy = function (unitName, energy)
	{
		var parts = [];
		var name = this.generateName(unitName);
		var result;

		units[unitName].parts.forEach(function(part) {
			var partEnergy = energy * part.weight;
			var numberParts = Math.floor(partEnergy/this.costs[part.part]);

			if (numberParts < part.minimum)
				numberParts = part.minimum;
			for (x = 0; x < numberParts; x++)
			{
				parts.push(part.part);
			}
		}, this);

		result = this.createCreep(parts, name, units[unitName].memory);
		if (_.isString(result))
		{
			console.log('+++++++++++++++++++Creating creep ' + unitName + ' : ' + name + " result: " + result);
			var creep = Game.creeps[name];
			creep.initMotive();

		} else {
			console.log('-------------------Failed creating creep ' + unitName + ' : ' + name + " result: " + result);
		}
	};
};