//-------------------------------------------------------------------------
// Room.prototype
//-------------------------------------------------------------------------

module.exports = function()
{
	Room.prototype.getCostParts = function (parts)
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

	Room.prototype.getResources = function ()
	{
		var resources = {};
		// determine room resources ----------------------------------------------------------------------------
		// energy
		resources.spawnEnergy = this.getSpawnEnergy();

		// get room collector status
		resources.controllerStatus = this.getControllerStatus();

		// output info
		console.log("---- Room Resources: " + this.name);
		console.log('  Spawn Energy: ' + resources.spawnEnergy.energy + '/' + resources.spawnEnergy.energyCapacity + ' Controller Level: ' + resources.controllerStatus.level + ' ' + resources.controllerStatus.progress + '/' + resources.controllerStatus.progressTotal + ' Downgrade: ' + resources.controllerStatus.ticksToDowngrade);

		// get unit resources
		resources.units = [];
		for (var unitName in units)
		{

			resources.units[unitName] = {};
			resources.units[unitName].total = this.countUnits(unitName);
			resources.units[unitName].allocated = 0;
			resources.units[unitName].unallocated = resources.units[unitName].total;
			resources.units[unitName].unassigned = this.countUnassignedUnits(unitName);
			resources.units[unitName].assigned = this.countAssignedUnits(unitName);
			console.log("  " + unitName + " total: " + resources.units[unitName].total
				+ " Assigned/UnAssigned: " + resources.units[unitName].assigned
				+ "/" + resources.units[unitName].unassigned);
		}
		return resources;
	};

	Room.prototype.getSpawnEnergy = function ()
	{
		var result = {};
		result.energy = 0;
		result.energyCapacity = 0;

		// Enumerate over spawns
		for (var spawnName in Game.spawns)
		{
			var spawn = Game.spawns[spawnName];
			if (spawn.room.name == this.name)
			{
				result.energy += spawn.energy;
				result.energyCapacity += spawn.energyCapacity;
			}
		}

		var extenders = this.find(FIND_MY_STRUCTURES , {filter: {structureType: STRUCTURE_EXTENSION}});
		extenders.forEach(function (ex)
		{
			result.energy += ex.energy;
			result.energyCapacity += ex.energyCapacity;
		} , this);

		return result;
	};

	Room.prototype.getControllerStatus = function ()
	{
		var result = {};

		// Enumerate over spawns
		var controller = this.controller;

		if (controller.my)
		{
			result.progress = controller.progress;
			result.progressTotal = controller.progressTotal;
			result.ticksToDowngrade = controller.ticksToDowngrade;
			result.level = controller.level;
		} else {
			result.progress = 0;
			result.progressTotal = 0;
			result.ticksToDowngrade = 0;
			result.level = 0;
		}

		return result;
	};

	Room.prototype.countCreeps = function ()
	{
		var result = this.getCreeps().length;

		return result;
	};

	Room.prototype.getCreeps = function ()
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName;
		});
		return result;
	};

	Room.prototype.countUnits = function (unitName)
	{
		var result = this.getUnits(unitName).length;
		return result;
	};

	Room.prototype.getUnits = function (unitName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.unit == unitName;
		});
		return result;
	};

	Room.prototype.countMotivationCreeps = function (motivationName)
	{
		var result = this.getRoomMotivationCreeps(motivationName).length;
		return result;
	};

	Room.prototype.getMotivationCreeps = function (motivationName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == motivationName;
		});
		return result;
	};

	Room.prototype.countMotivationUnits = function (motivationName , unitName)
	{
		var result = this.getMotivationUnits(motivationName , unitName).length;
		return result;
	};

	Room.prototype.getMotivationUnits = function (motivationName , unitName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.unit == unitName;
		});
		return result;
	};

	Room.prototype.countMotivationNeedCreeps = function (motivationName , needName)
	{
		var result = this.getMotivationNeedCreeps(motivationName , needName).length;
		return result;
	};

	Room.prototype.getMotivationNeedCreeps = function (motivationName , needName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.motive.need == needName;
		});
		return result;
	};

	Room.prototype.countMotivationNeedUnits = function (motivationName , needName , unitName)
	{
		var result = this.getMotivationNeedUnits(motivationName , needName , unitName).length;
		return result;
	};

	Room.prototype.getMotivationNeedUnits = function (motivationName , needName , unitName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.motive.need == needName
				&& creep.memory.unit == unitName;
		});
		return result;
	};

	Room.prototype.countAssignedUnits = function (unitName)
	{
		var result = this.getAssignedUnits(unitName).length;
		return result;
	};

	Room.prototype.getAssignedUnits = function (unitName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation != ""
				&& creep.memory.motive.need != ""
				&& creep.memory.unit == unitName;
		});
		return result;
	};

	Room.prototype.countUnassignedUnits = function (unitName)
	{
		var result = this.getUnassignedUnits(unitName).length;
		return result;
	};

	Room.prototype.getUnassignedUnits = function (unitName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == ""
				&& creep.memory.motive.need == ""
				&& creep.memory.unit == unitName;
		});

		return result;
	};

	Room.prototype.countLostCreeps = function ()
	{
		var result = this.getLostCreeps().length;
		return result;
	};

	Room.prototype.getLostCreeps = function ()
	{
		var debug = true;
		var roomName = this.name;

		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room != roomName;
		});

		return result;
	};

	Room.prototype.countCreepsOnSource = function (sourceId)
	{
		var result = this.getCreepsOnSource(sourceId).length;
		return result;
	};

	Room.prototype.getCreepsOnSource = function (sourceId)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			var need = Game.rooms[creep.room.name].memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
			return (creep.room.name == roomName
					&& creep.memory.motive.room == roomName
					&& creep.memory.motive.motivation != ""
					&& creep.memory.motive.need != ""
				) && (
					(!lib.isNull(need) && !lib.isNull(need.sourceId))
					&&
					(!lib.isNull(creep.memory.job) && need.sourceId == sourceId && creep.memory.job.mode == 0)
				);
		});
		return result;
	};

	Room.prototype.findUnallocatedUnit = function (unitName)
	{
		return this.findUnallocatedUnits(unitName)[0];
	};

	Room.prototype.findUnallocatedUnits = function (unitName)
	{
		var roomName = this.name;
		var result = _.filter(Game.creeps , function (creep)
		{
			return creep.room.name == roomName
				&& creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == ""
				&& creep.memory.motive.need == ""
				&& creep.memory.unit == unitName;
		});
		return result;
	};

	Room.prototype.handleLostCreeps = function()
	{
		var lostCreeps = this.getLostCreeps();
		lostCreeps.forEach(function (creep)
		{
			var exit = creep.room.findExitTo(creep.memory.motive.room);
			// and move to exit
			creep.moveTo(creep.pos.findClosestByPath(exit, { ignoreCreeps: true }));
			creep.say("Leave!");
		}, this);
	};
};