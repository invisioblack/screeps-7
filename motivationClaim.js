//----------------------------------------------------------------------------------------------------------------------
// motivationClaimRoom
//-------------------------------------------------------------------------
"use strict";
let Motivation = require('Motivation.prototype')();

/**
 * Memory
 * Memory.claims - base object []
 * Memory.claims[].room - room to claim
 * Memory.claims[].spawnRoom - room to spawn claimers in
 * Memory.claims[].type - type of claim
 */

/**
 * MotivationClaim
 * @constructor
 */
let MotivationClaim = function ()
{
	Motivation.call(this);
	this.name = "motivationClaim";
	if (lib.isNull(Memory.claims))
	{
		Memory.claims = [];
	}
};

MotivationClaim.prototype = Object.create(Motivation.prototype);
MotivationClaim.prototype.constructor = MotivationClaim;

/**
 * getDesiredSpawnUnit
 * @returns {string}
 */
MotivationClaim.prototype.getDesiredSpawnUnit = function ()
{
	return "claimer";
};

MotivationClaim.prototype.getAssignableUnitNames = function ()
{
	return ["claimer"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationClaim.prototype.updateActive = function (roomName)
{
	Memory.rooms[roomName].motivations[this.name].active = true;
	return Memory.rooms[roomName].motivations[this.name].active;
};

/**
 * updateNeeds
 * @param roomName
 */
MotivationClaim.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	// only create needs if a controller is present
	if (!lib.isNull(room.controller))
	{
		// insure memory is initialized for needs
		if (lib.isNull(memory.needs))
		{
			memory.needs = {};
		}

		let needName = "claim." + roomName;
		let need;

		//console.log('Need Name: ' + needName);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needClaim";
			need.targetId = room.controller.id;
			need.priority = C.PRIORITY_1;
			need.demands = global[need.type].getUnitDemands(roomName , need , this.name);
		}
	}
};

/**
 * Export
 * @type {MotivationClaim}
 */
module.exports = new MotivationClaim();