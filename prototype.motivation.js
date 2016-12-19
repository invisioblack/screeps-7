//----------------------------------------------------------------------------------------------------------------------
// motivation
//----------------------------------------------------------------------------------------------------------------------
// memory --------------------------------------------------------------------------------------------------------------
// room.memory.motivations[this.name].init                  boolean - true if this motivation is inited
// room.memory.motivations[this.name].name
// room.memory.motivations[this.name].allocatedUnits
// room.memory.motivations[this.name].spawnAllocated
// room.memory.motivations[this.name].needs

//----------------------------------------------------------------------------------------------------------------------
// modules
//----------------------------------------------------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');

//----------------------------------------------------------------------------------------------------------------------
// object
//----------------------------------------------------------------------------------------------------------------------
module.exports = function ()
{
    var Motivation = function () {};

    Motivation.prototype.name = "Motivation";

    Motivation.prototype.init = function (roomName)
	{
		if (!Game.rooms[roomName].memory.motivations[this.name].init)
		{
			var room = Game.rooms[roomName];
			// init motivation object
			if (lib.isNull(room.memory.motivations[this.name]))
					room.memory.motivations[this.name] = {};
			
			// init default memory
			room.memory.motivations[this.name].name = this.name;
			room.memory.motivations[this.name].allocatedUnits = {};
			room.memory.motivations[this.name].spawnAllocated = false;
			room.memory.motivations[this.name].needs = {};
			this.setActive(roomName, false);

			
			// set init true
			Game.rooms[roomName].memory.motivations[this.name].init = true;
		}
	};

	Motivation.prototype.getUnitDemands = function (roomName)
	{
		var result = {};
		var room = Game.rooms[roomName];

		for (var needName in room.memory.motivations[this.name].needs)
		{
			var need = room.memory.motivations[this.name].needs[needName];
			for (var unitName in need.unitDemands)
			{
				if (lib.isNull(result[unitName]))
					result[unitName] = 0;
				result[unitName] += need.unitDemands[unitName];
			}
		}

		return result;
	};

	return Motivation;
};