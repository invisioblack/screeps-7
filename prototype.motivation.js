//-------------------------------------------------------------------------
// motivation
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');


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

	return Motivation;
};