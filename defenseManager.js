//------------------------------------------------------------------------------
// defenseManager
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// modules
//------------------------------------------------------------------------------
// library modules
var C = require('C');
var lib = require('lib');
var resourceManager = require("resourceManager");

// game modules
var units = require("units");

//------------------------------------------------------------------------------
// Declarations
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// function
//------------------------------------------------------------------------------
module.exports =
	{
		//--------------------------------------------------------------------------
		// Declarations
		//--------------------------------------------------------------------------

		//--------------------------------------------------------------------------
		// top level functions
		//--------------------------------------------------------------------------
		"safeModeFailsafe": function (roomName)
		{
			var room = Game.rooms[roomName];
			if (room.controller.my)
			{
				var controller = room.controller;
				var hostiles = this.getAgressivesPresent(roomName);
				//safeMode	number	How many ticks of safe mode remaining, or undefined.
				var safeMode = lib.nullProtect(controller.safeMode, 0);
				//safeModeAvailable	number	Safe mode activations available to use.
				var safeModeAvailable = lib.nullProtect(controller.safeModeAvailable, 0);
				//safeModeCooldown	number	During this period in ticks new safe mode activations will be blocked, undefined if cooldown is inactive.
				var safeModeCooldown = lib.nullProtect(controller.safeModeCooldown, 0);

				if (hostiles.length && !safeMode && safeModeAvailable && !safeModeCooldown)
				{
					console.log("!!!!!!!!!!!!!!! ACTIVATING SAFE MODE !!!!!!!!!!!!!!!");
					controller.activateSafeMode();
				}
				console.log(">>>> Safe Mode Status: Hostiles: " + hostiles.length
					+ " SafeMode: " + safeMode
					+ " SafeModeAvailable: " + safeModeAvailable
					+ " SafeModeCooldown: " + safeModeCooldown);
			}
		},

		"getAgressivesPresent": function (roomName)
		{
			var room = Game.rooms[roomName];
			var hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
			return hostileCreeps;
		},

		"motivateTowers": function (roomName)
		{
			var room = Game.rooms[roomName];
			if (room.controller.my)
			{
				// find all towers
				var towers = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_TOWER}});
				// for each tower
				towers.forEach(function (tower)
				{
					tower.autoAttack();
				}, this);
			}
		}
	};