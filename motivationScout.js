"use strict";

let Motivation = require("Motivation.prototype")();

/**
 * MotivationScout
 * @constructor
 */
let MotivationScout = function ()
{
	Motivation.call(this);
	this.name = "motivationScout";
};

MotivationScout.prototype = Object.create(Motivation.prototype);
MotivationScout.prototype.constructor = MotivationScout;

MotivationScout.prototype.getDesiredSpawnUnit = function (roomName)
{
	return "scout";
};

MotivationScout.prototype.getAssignableUnitNames = function ()
{
	return ["scout"];
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 * @returns boolean
 */
MotivationScout.prototype.updateActive = function (roomName)
{
	Memory.rooms[roomName].motivations[this.name].active = true;
	return Memory.rooms[roomName].motivations[this.name].active;
};

MotivationScout.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let scoutTargets, need, needName;

	if (room.isMine)
	{
		scoutTargets = _.filter(Memory.scoutTargets , {sourceRoom: roomName});
	}
	else
	{
		scoutTargets = _.filter(Memory.scoutTargets , {targetRoom: roomName});
	}

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
		memory.needs = {};

	_.forEach(scoutTargets , st =>
	{
		needName = "scout." + st.targetRoom;
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.name = needName;
			need.type = "needScout";
			need.targetRoom = st.targetRoom;
			need.sourceRoom = st.sourceRoom;
			need.priority = C.PRIORITY_1;
		}
	});

	// cull unneeded needs
	_.forEach(memory.needs, n =>
	{
		scoutTargets = _.filter(Memory.scoutTargets , {targetRoom: n.targetRoom});
		if (!scoutTargets.length)
			delete memory.needs[memory.needs.name];
	});
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationScout();
