//-------------------------------------------------------------------------
// StructureTower.prototype
//-------------------------------------------------------------------------
"use strict";

StructureTower.prototype.autoAttack = function ()
{
	let roomName = this.room.name;
	let targets = [];
	let target;

	if (Game.rooms[roomName].memory.threat.level >= C.THREAT_NPC)
	{
		targets = Game.rooms[roomName].memory.threat.threats;
		if (targets.length > 0)
		{
			target = Game.getObjectById(targets[_.random(0 , targets.length - 1)].id);
		}

		if (!lib.isNull(target))
		{
			this.attack(target);
		}
	}
};

StructureTower.prototype.autoCreepHeal = function ()
{
	let roomName = this.room.name;
	let woundedCreep = _.min(global.cache.rooms[roomName].creeps , o => o.hitsMax - o.hits);
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
	let structures = roomManager.getStructuresType(this.room.name, STRUCTURE_ALL_NOWALL);
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
		structures = roomManager.getStructuresType(this.room.name, STRUCTURE_ALL_WALL);
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
