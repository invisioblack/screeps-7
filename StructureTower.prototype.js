//-------------------------------------------------------------------------
// StructureTower.prototype
//-------------------------------------------------------------------------

StructureTower.prototype.autoAttack = function ()
{
	let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	if (!lib.isNull(target))
	{
		this.attack(target);
	}
};

StructureTower.prototype.autoCreepHeal = function ()
{
	let woundedCreep = this.pos.findClosestByRange(FIND_MY_CREEPS, { filter: function(object) {
			return ( object.hits < object.hitsMax );
		}
	});

	//console.log(":::::::::::::::::::::" + JSON.stringify(woundedCreep));

	if (!lib.isNull(woundedCreep) && this.energy > (this.energyCapacity * config.towerPowerFactor))
		this.heal(woundedCreep);
};

// don't use this yet, it will go crazy on the walls
StructureTower.prototype.autoRepair = function ()
{
	let wallHP = config.wallHP[this.room.controller.level];
	// non walls/ramparts
	let damagedBuildings = this.room.find(FIND_STRUCTURES, { filter: function(object) {
		return (object.structureType != STRUCTURE_WALL
			&& object.structureType != STRUCTURE_RAMPART
			&& object.hits < (object.hitsMax * config.towerRepairFactor));
		}
	});

	console.log(JSON.stringify(damagedBuildings));

	if (!lib.isNull(damagedBuildings[0]) && this.energy > (this.energyCapacity * config.towerPowerFactor))
		this.repair(damagedBuildings[0]);

	// walls and ramparts
	damagedBuildings = this.room.find(FIND_STRUCTURES, { filter: function(object) {
			return (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART)
				&& object.hits < (wallHP * config.towerRepairFactor);
		}
	});

	//console.log(JSON.stringify((wallHP * config.towerRepairFactor)));
	//console.log(JSON.stringify(damagedBuildings));

	if (!lib.isNull(damagedBuildings[0]) && this.energy > (this.energyCapacity * config.towerPowerFactor))
		this.repair(damagedBuildings[0]);
};

module.exports = function() {};
