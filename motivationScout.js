//-------------------------------------------------------------------------
// motivationGarrison
//-------------------------------------------------------------------------
"use strict";
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Motivation = require("Motivation.prototype")();

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationScout = function ()
{
	Motivation.call(this);
	this.name = "motivationScout";
};

MotivationScout.prototype = Object.create(Motivation.prototype);
MotivationScout.prototype.constructor = MotivationScout;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationScout.prototype.getDemands = function (roomName)
{
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName , result);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	lib.log(`Room: ${roomName} Scout Demands: ${unitName}: ${result.units[unitName]} Spawn: ${result.spawn}` , debug);
	return result;
};

MotivationScout.prototype.getDesireSpawn = function (roomName , demands)
{
	let debug = false;
	let result = false;
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];

	/**
	 * Should spawn if any scout targets with this source room if the target room has not been seen in the time spawn
	 * and there is no scout assigned to it
	 *
	 */
	let unitsDemandedTotal = 0;
	let unitsTotal = 0;

	if (memory.active)
	{
		let scoutTargets;
		if (room.getIsMine())
		{
			scoutTargets = _.filter(Memory.scoutTargets , {sourceRoom: roomName});
		}
		else
		{
			scoutTargets = _.filter(Memory.scoutTargets , {targetRoom: roomName});
		}

		_.forEach(memory.needs , (need , needName) =>
		{
			let unitsDemanded = lib.nullProtect(need.demands["scout"] , 0);
			let units = Room.countUnits(need.targetRoom , "scout");
			unitsDemandedTotal += unitsDemanded;
			unitsTotal += units;
			if (units < unitsDemanded)
			{
				//console.log(need.name);
				result = true;
			}
			//console.log(`Need: ${needName} Units: ${units} UnitsDemanded: ${unitsDemanded}`);
		});
	}

	lib.log(`Room: ${roomLink(roomName)} ${this.name}.getDesireSpawn: active: ${memory.active} Result: ${result} unit: scout A/D: ${unitsTotal}/${unitsDemandedTotal} R/D: ${unitsTotal}/${room.memory.demands["scout"]}` , debug);

	return result;
	//return false;
};

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
 */
MotivationScout.prototype.updateActive = function (roomName)
{
	Game.rooms[roomName].memory.motivations[this.name].active = true;
};

MotivationScout.prototype.updateNeeds = function (roomName)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	let scoutTargets;

	if (room.getIsMine())
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

	let need;
	_.forEach(scoutTargets , st =>
	{
		let needName = "scout." + st.targetRoom;
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
