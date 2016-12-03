//-------------------------------------------------------------------------
// motivation
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');

//-------------------------------------------------------------------------
// object
//-------------------------------------------------------------------------
module.exports = function ()
{
    var Motivation = function () {};

    Motivation.prototype.name = "Motivation";

    Motivation.prototype.init = function (roomName)
	{
		if (!this.getInit(roomName))
		{
			var room = Game.rooms[roomName];
			// init motivation object
			if (lib.isNull(room.memory.motivations[this.name]))
					room.memory.motivations[this.name] = {};
			
			// init default memory
			room.memory.motivations[this.name].name = this.name;
			room.memory.motivations[this.name].allocatedUnits = {};
			this.setActive(roomName, false);
			
			// set init true
			Game.rooms[roomName].memory.motivations[this.name].init = true;
		}
	};

	Motivation.prototype.getInit = function (roomName)
	{
		var room = Game.rooms[roomName];

		if (!lib.isNull(room.memory.motivations[this.name])
			&& room.memory.motivations[this.name].init) {
			 return true;
		} else {
			return false;
		}
	};

	Motivation.prototype.setActive = function (roomName, state)
	{
		if (state) {
			Game.rooms[roomName].memory.motivations[this.name].active = true;
		} else {
			Game.rooms[roomName].memory.motivations[this.name].active = false;
		}
	};

	Motivation.prototype.getActive = function (roomName)
	{
		if (Game.rooms[roomName].memory.motivations[this.name].active) {
			 return true;
		} else {
			return false;
		}
	};

	Motivation.prototype.setPriority = function (roomName, priority)
	{
		Game.rooms[roomName].memory.motivations[this.name].priority = priority;
	};

	Motivation.prototype.getPriority = function (roomName)
	{
		var result = C.PRIORITY_5;
		if (!lib.isNull(Game.rooms[roomName].memory.motivations[this.name])) 
			result = Game.rooms[roomName].memory.motivations[this.name].priority;
		
		return result;
	};

	Motivation.prototype.setAllocatedUnits = function (roomName, unit, value)
	{
		Game.rooms[roomName].memory.motivations[this.name].allocatedUnits[unit] = value;
	};

	Motivation.prototype.getAllocatedUnits = function (roomName, unit)
	{
		var result = C.PRIORITY_5;
		if (!lib.isNull(Game.rooms[roomName].memory.motivations[this.name])) 
			result = Game.rooms[roomName].memory.motivations[this.name].allocatedUnits[unit];
		
		return result;
	};

	return Motivation;
};