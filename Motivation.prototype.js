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

		let creeps = Room.getMotivationCreeps(roomName , this.name);
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
	 * getDemands - lazy loading
	 * @param roomName
	 */
	Motivation.prototype.getDemands = function (roomName)
	{
		//lib.log(`getDemands Room: ${roomName} Motive: ${this.name} Time: ${Memory.rooms[roomName].motivations[this.name].demands.lastUpdated} / ${Game.time}`, roomName === "W8N3");
		if (lib.isNull(Memory.rooms[roomName].motivations[this.name].demands) || Memory.rooms[roomName].motivations[this.name].demands.lastUpdated !== Game.time)
		{
			Memory.rooms[roomName].motivations[this.name].demands = {};
			let demands = Memory.rooms[roomName].motivations[this.name].demands;
			demands.units = {};
			demands.lastUpdated = Game.time;

			_.forEach(Memory.rooms[roomName].motivations[this.name].needs , (need , needName) =>
			{
				let unitDemands = global[need.type].getUnitDemands(roomName , need , this.name);

				//lib.log("----------- demands: " + JSON.stringify(unitDemands) , debug);
				_.forEach(unitDemands , (demand , unitName) =>
				{
					if (lib.isNull(demands.units[unitName]))
					{
						demands.units[unitName] = 0;
					}
					demands.units[unitName] += demand;
				});
			});

			// does this demand spawn?
			demands.spawn = this.getDesireSpawn(roomName , demands.units);
		}

		return Memory.rooms[roomName].motivations[this.name].demands;
	};

	Motivation.prototype.getDesireSpawn = function (roomName , unitDemands)
	{
		let debug = false;
		let result = false;

		//lib.log(`Room: ${roomLink(roomName)} ${this.name}.getDesireSpawn` , debug);
		if (Room.getIsMine(roomName))
		{
			lib.log(`Room: ${roomLink(roomName)} ${this.name}.getDesireSpawn` , debug);
			let room = Game.rooms[roomName];
			let memory = Memory.rooms[roomName].motivations[this.name];
			let unitName = this.getDesiredSpawnUnit(roomName , unitDemands);
			let unitsDemanded = unitDemands[unitName];
			let units = Room.countMotivationUnits(roomName , this.name , unitName);
			let numHomeRoomUnits = Room.countHomeRoomUnits(roomName, unitName);

			if (numHomeRoomUnits >= room.maxUnits[unitName])
			{
				return false;
			}

			if (unitsDemanded > units)
			{
				result = true;
			}

			//lib.log(`Room: ${roomLink(roomName)} ${this.name}.getDesireSpawn: active: ${memory.active} Result: ${result} unit: ${unitName} A/D: ${units}/${unitsDemanded}` , debug);

			return result;
		}
		else
		{
			return false;
		}
	};

	return Motivation;
};