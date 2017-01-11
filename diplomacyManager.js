"use strict";
global.PLAYER_HOSTILE = 0;
global.PLAYER_TRUCE = 1; // If they attack us, switches back to murder mode.
global.PLAYER_TRUSTED = 2;
global.PLAYER_ALLY = 3;

module.exports = {
	set: function(name, state = PLAYER_HOSTILE) {
		if(!Memory.players)
			Memory.players = {};
		Memory.players[name] = state;
		Game.notify("Player " + name + " status set to " + state);
	},

	status: function(name) {
		if(!Memory.players || !Memory.players[name])
			return PLAYER_HOSTILE;
		return Memory.players[name];
	},

	reset: function() {
		delete Memory.players;
	}

};
