//----------------------------------------------------------------------------------------------------------------------
// motivation
//----------------------------------------------------------------------------------------------------------------------
// memory --------------------------------------------------------------------------------------------------------------
// room.memory.motivations[this.name].init                  boolean - true if this motivation is inited
// room.memory.motivations[this.name].name
// room.memory.motivations[this.name].allocatedUnits
// room.memory.motivations[this.name].spawnAllocated
// room.memory.motivations[this.name].needs

module.exports = function ()
{
    var Motivation = function () {};

    Motivation.prototype.name = "Motivation";

    Motivation.prototype.init = function (roomName)
	{
		// init memory object
		if (lib.isNull(Game.rooms[roomName].memory.motivations[this.name]))
			Game.rooms[roomName].memory.motivations[this.name] = {};

		// if init has not been completed, then init
		if (!Game.rooms[roomName].memory.motivations[this.name].init)
		{
			var room = Game.rooms[roomName];

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

	Motivation.prototype.getUnitDemands = function (roomName)
	{
		var debug = false; //roomName == "W8N2";
		var result = {};
		var room = Game.rooms[roomName];

		lib.log(room.name, debug);
		for (var needName in room.memory.motivations[this.name].needs)
		{
			var need = room.memory.motivations[this.name].needs[needName];
			var demands = global[need.type].getUnitDemands(roomName, need);


			lib.log("----------- Motivation: " + JSON.stringify(demands), room.name == "W8N2", debug);
			for (var unitName in demands)
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