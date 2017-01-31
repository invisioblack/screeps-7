//----------------------------------------------------------------------------------------------------------------------
// motivation
//----------------------------------------------------------------------------------------------------------------------
// memory --------------------------------------------------------------------------------------------------------------
// room.memory.motivations[this.name].init                  boolean - true if this motivation is inited
// room.memory.motivations[this.name].name
// room.memory.motivations[this.name].allocatedUnits
// room.memory.motivations[this.name].spawnAllocated
// room.memory.motivations[this.name].needs
"use strict";

module.exports = function ()
{
	let Motivation = function ()
	{
	};

	Motivation.prototype.name = "Motivation";

	Motivation.prototype.init = function (roomName)
	{
		if (lib.isNull(Game.rooms[roomName]))
		{
			return;
		}

		if (lib.isNull(Game.rooms[roomName].memory.motivations))
		{
			Game.rooms[roomName].memory.motivations = {};
		}

		if (lib.isNull(Game.rooms[roomName].memory.motivations[this.name]))
		{
			Game.rooms[roomName].memory.motivations[this.name] = {};
		}

		// if init has not been completed, then init
		if (!Game.rooms[roomName].memory.motivations[this.name].init)
		{
			let room = Game.rooms[roomName];

			// init default memory
			room.memory.motivations[this.name].name = this.name;
			room.memory.motivations[this.name].allocatedUnits = {};
			room.memory.motivations[this.name].spawnAllocated = false;
			room.memory.motivations[this.name].needs = {};
			room.memory.motivations[this.name].active = false;
			room.memory.motivations[this.name].demands = this.getDemands(room.name);

			// set init true
			Game.rooms[roomName].memory.motivations[this.name].init = true;
		}
	};

	Motivation.prototype.deInit = function (roomName)
	{
		delete Game.rooms[roomName].memory.motivations[this.name];

		let creeps = Room.getRoomMotivationCreeps(roomName , this.name);
		_.forEach(creeps , (c) =>
		{
			c.deassignMotive();
		});

	};

	Motivation.prototype.isInit = function (roomName)
	{
		return !lib.isNull(Game.rooms[roomName].memory.motivations[this.name]) && Game.rooms[roomName].memory.motivations[this.name].init;
	};

	Motivation.prototype.getUnitDemands = function (roomName)
	{
		let debug = false;
		let result = {};
		let roomMemory = Memory.rooms[roomName];

		lib.log(roomName , debug);
		_.forEach(roomMemory.motivations[this.name].needs , (need , needName) =>
		{
			//console.log("!!!!!!!!!!!!---:" + need.type);
			let demands = global[need.type].getUnitDemands(roomName , need , this.name);

			lib.log("----------- demands: " + JSON.stringify(demands) , debug);
			_.forEach(demands , (demand , unitName) =>
			{
				if (lib.isNull(result[unitName]))
				{
					result[unitName] = 0;
				}
				result[unitName] += demand;
			});
		});

		return result;
	};

	return Motivation;
};