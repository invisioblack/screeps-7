"use strict";

module.exports = {

	/**
	 * Set a relation to a player.
	 * @param name
	 * @param state
	 */
	set: function (name , state = C.RELATION_HOSTILE)
	{
		if (!Memory.players)
		{
			Memory.players = {};
		}
		Memory.players[name] = state;
		Game.notify("Player " + name + " status set to " + state);
	} ,

	/**
	 * Get relation for a player.
	 * @param name
	 * @returns {*}
	 */
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

	/**
	 * Reset player relation. This deletes the memory key.
	 */
	reset: function ()
	{
		delete Memory.players;
	}

};
