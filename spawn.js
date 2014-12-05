module.exports = 
{
	spawnHarvester: function (name) {
		var creep = Game.spawns.Spawn1.createCreep([Game.WORK, Game.CARRY, Game.MOVE], name);
		creep.memory.role = 'harvester';
	},

	spawnBuilder: function (name) {
		var creep = Game.spawns.Spawn1.createCreep([Game.WORK, Game.WORK, Game.WORK, Game.CARRY, Game.MOVE], name);
		creep.memory.role = 'builder';
	},

	spawnGuard: function (name) {
		var creep = Game.spawns.Spawn1.createCreep([Game.TOUGH, Game.ATTACK, Game.MOVE, Game.MOVE], name);
		creep.memory.role = 'guard';
	}
}



