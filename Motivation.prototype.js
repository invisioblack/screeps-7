"use strict";

module.exports = function ()
{
	/**
	 * Motivation base object
	 * @constructor
	 */
	let Motivation = function ()
	{
	};

	Motivation.prototype.name = "Motivation";

	/**
	 * initializes a motivation such that it can be processed by the room.
	 * @param roomName
	 */
	Motivation.prototype.init = function (roomName)
	{
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
			room.memory.motivations[this.name].demands = this.getDemands(roomName);

			// set init true
			Game.rooms[roomName].memory.motivations[this.name].init = true;
		}
	};

	/**
	 * deInit
	 * @param roomName
	 */
	Motivation.prototype.deInit = function (roomName)
	{
		delete Game.rooms[roomName].memory.motivations[this.name];

		let creeps = Room.getRoomMotivationCreeps(roomName , this.name);
		_.forEach(creeps , (c) =>
		{
			c.deassignMotive();
		});

	};

	/**
	 * isInit
	 * @param roomName
	 * @returns {boolean|init|*|module.exports.init}
	 */
	Motivation.prototype.isInit = function (roomName)
	{
		return !lib.isNull(Game.rooms[roomName].memory.motivations[this.name]) && Game.rooms[roomName].memory.motivations[this.name].init;
	};

	/**
	 *
	 * @param roomName
	 * @returns {{}}
	 */
	Motivation.prototype.getUnitDemands = function (roomName)
	{
		let debug = false;
		let result = {};
		let roomMemory = Memory.rooms[roomName];

		lib.log(roomName , debug);
		_.forEach(roomMemory.motivations[this.name].needs , (need , needName) =>
		{
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