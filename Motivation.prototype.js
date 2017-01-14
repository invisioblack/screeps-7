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
    let Motivation = function () {};

    Motivation.prototype.name = "Motivation";

    Motivation.prototype.init = function (roomName)
	{
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

			// set init true
			Game.rooms[roomName].memory.motivations[this.name].init = true;
		}
	};

	Motivation.prototype.deInit = function (roomName)
	{
		delete Game.rooms[roomName].memory.motivations[this.name];

		let creeps = creepManager.getRoomMotivationCreeps(roomName, this.name);
		_.forEach(creeps, (c) => {
			c.deassignMotive();
			c.resetSource();
		});

	};

	Motivation.prototype.isInit = function (roomName)
	{
		return !lib.isNull(Game.rooms[roomName].memory.motivations[this.name]) && Game.rooms[roomName].memory.motivations[this.name].init;
	};

	Motivation.prototype.getUnitDemands = function (roomName)
	{
		let debug = false; //roomName === "W8N2";
		let result = {};
		let room = Game.rooms[roomName];

		lib.log(room.name, debug);
		for (let needName in room.memory.motivations[this.name].needs)
		{

			let need = room.memory.motivations[this.name].needs[needName];
			//console.log("!!!!!!!!!!!!---:" + need.type);
			let demands = global[need.type].getUnitDemands(roomName, need, this.name);


			lib.log("----------- demands: " + JSON.stringify(demands), room.name === "W8N2", debug);
			for (let unitName in demands)
			{
				if (lib.isNull(result[unitName]))
					result[unitName] = 0;
				result[unitName] += demands[unitName];
			}
		}

		return result;
	};

	return Motivation;
};