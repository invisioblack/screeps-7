"use strict";

module.exports = {
	set: function (name , state = C.RELATION_HOSTILE)
	{
		if (!Memory.players)
		{
			Memory.players = {};
		}
		Memory.players[name] = state;
		Game.notify("Player " + name + " status set to " + state);
	} ,

	status: function (name)
	{
		if (name === C.ME)
		{
			return C.RELATION_ME;
		}
		if (!Memory.players || !Memory.players[name])
		{
			return C.RELATION_HOSTILE;
		}
		return Memory.players[name];
	} ,

	reset: function ()
	{
		delete Memory.players;
	}

};
