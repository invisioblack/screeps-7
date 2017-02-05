//-------------------------------------------------------------------------
// StructureTower.prototype
//-------------------------------------------------------------------------
"use strict";

StructureTower.prototype.autoAttack = function ()
{
	let target;

	if (this.room.threat.level >= C.THREAT_NPC)
	{
		if (this.threat.threats.length > 0)
		{
			target = Game.getObjectById(this.threat.threats[_.random(0 , this.threat.threats.length - 1)].id);
		}

		if (!lib.isNull(target))
		{
			this.attack(target);
		}
	}
};

StructureTower.prototype.autoCreepHeal = function ()
{
	let woundedCreep = _.min(Room.getCreeps(this.room.name) , o => o.hitsMax - o.hits);
	let wounds = woundedCreep.hitsMax - woundedCreep.hits;

	//console.log(":::::::::::::::::::::" + JSON.stringify(woundedCreep));

	if (!lib.isNull(woundedCreep) && wounds > 0 && this.energy > (this.energyCapacity * config.towerPowerFactor))
	{
		this.heal(woundedCreep);
	}
};

// don't use this yet, it will go crazy on the walls
StructureTower.prototype.autoRepair = function ()
{
	let wallHP = config.wallHP[this.room.controller.level];
	// non walls/ramparts
	let structures = Room.getStructuresType(this.room.name, STRUCTURE_ALL_NOWALL);
	let damagedBuildings = _.filter(structures , object => object.hits < (object.hitsMax * config.towerRepairFactor));

	//console.log(JSON.stringify(damagedBuildings));

	if (!lib.isNull(damagedBuildings[0]) && this.energy > (this.energyCapacity * config.towerPowerFactor))
	{
		let target = _.max(damagedBuildings , (c) => c.hitsMax - c.hits);
		this.repair(target);
		return true;
	}
	else
	{
		// walls and ramparts
		structures = Room.getStructuresType(this.room.name, STRUCTURE_ALL_WALL);
		damagedBuildings = _.filter(structures , object => object.hits < (wallHP * config.towerRepairFactor));

		//console.log(JSON.stringify((wallHP * config.towerRepairFactor)));
		//console.log(JSON.stringify(damagedBuildings));

		let target = _.min(damagedBuildings , 'hits');

		//console.log(target);

		if (!lib.isNull(target) && this.energy > (this.energyCapacity * config.towerPowerFactor))
		{
			this.repair(target);
			return true;
		}
		else
		{
			return false;
		}
	}
};

module.exports = function ()
{
};
