//----------------------------------------------------------------------------------------------------------------------
// motivationClaimRoom
//-------------------------------------------------------------------------
"use strict";
let Motivation = require('Motivation.prototype')();

//-------------------------------------------------------------------------
// memory
//-------------------------------------------------------------------------
// Memory.claims - base object []
// Memory.claims[].room - room to claim
// Memory.claims[].spawnRoom - room to spawn claimers in
// Memory.claims[].type - type of claim

//-------------------------------------------------------------------------
// constructor
//-------------------------------------------------------------------------
let MotivationClaimRoom = function ()
{
	Motivation.call(this);
	this.name = "motivationClaimRoom";
	if (lib.isNull(Memory.claims))
	{
		Memory.claims = [];
	}
};

MotivationClaimRoom.prototype = Object.create(Motivation.prototype);
MotivationClaimRoom.prototype.constructor = MotivationClaimRoom;

//-------------------------------------------------------------------------
// implementation
//-------------------------------------------------------------------------
MotivationClaimRoom.prototype.getDemands = function (roomName, resources) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	//console.log(JSON.stringify(result.units));
	lib.log("  Claim Room Demands : " + unitName + ": " + result.units[unitName] + " Spawn: " + result.spawn, false);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationClaimRoom.prototype.getDesiredSpawnUnit = function ()
{
	return "claimer";
};

MotivationClaimRoom.prototype.getDesireSpawn = function (roomName, demands)
{
	let debug = false;
	let result = false;
	let room = Game.rooms[roomName];
	let numWorkers = Memory.rooms[roomName].resources.units["worker"].total;

	// filter this to only claims spawning in specified room
	let spawnClaims = _.filter(Memory.claims, function (c){
		return c.spawnRoom === roomName;
	});

	lib.log(">&>&>&>&>&>&> getDesireSpawn: " + room.name
		+ " workers: " + numWorkers
		+ " spawn claims: " + _.size(spawnClaims)
		, debug);

	// if it isn't our room or we have a worker shortage, false
	if (!room.getIsMine() || numWorkers <= config.medWorkers)
	{
		lib.log(">&>&>&>&>&>&> FAIL", debug);
		return false;
	}

	// if this room is specified as spawn for another room, and the demanded units don't exist, true

	_.forEach(spawnClaims, function (c) {
		//console.log(c.room + ": " + _.has(global, "cache.rooms." + c.room + ".units.claimer"));
		let numClaimers = _.has(global, "cache.rooms." + c.room + ".units.claimer") ? global.cache.rooms[c.room].units["claimer"].length : 0;
		let claimRoom = Game.rooms[c.room];
		let reservation;

		if (!lib.isNull(claimRoom) && !lib.isNull(claimRoom.controller) && !lib.isNull(claimRoom.controller.reservation))
		{
			reservation = claimRoom.controller.reservation.ticksToEnd;
		} else if (!lib.isNull(Memory.rooms[c.room].reservation))
		{
			let timeDiff = Game.time - Memory.rooms[c.room].reservation.time;
			reservation = lib.nullProtect(Memory.rooms[c.room].reservation.reservation, 0) - timeDiff;
			//console.log(timeDiff);
		} else
			reservation = 0;

		// don't request a spawn if somebody is already there, or we're not worried about degrade
		if (!numClaimers && reservation < config.claimTicks)
			result = true;

		lib.log("Room: " + c.room + " COUNT: " + numClaimers + " TICKS: " + reservation, debug);
	});

	lib.log("Spawn claimer " + result, debug);
	return result;
};

MotivationClaimRoom.prototype.updateActive = function (roomName, demands)
{
	let room = Game.rooms[roomName];
	let memory = room.memory.motivations[this.name];
	// TODO: THIS ISN'T RIGHT
	// filter this to only claims spawning in specified room
	let countSpawnClaims = _.size(Memory.claims, function (c){
		return c.spawnRoom === roomName;
	});
	let countClaims = _.size(Memory.claims, function (c){
		return c.room === roomName;
	});

	// handle updating active
	if (lib.isNull(room.controller))
	{
		// if the room does not have a controller, inactive
		memory.active = false;
	}
	else if (room.controller.my)
	{
		// be active if we are specified as a spawning room
		if (countSpawnClaims)
			memory.active = true;
		else
			memory.active = false;
	}
	else // not my room
	{
		// be active if we are specified as a claim room
		if (countClaims)
			memory.active = true;
		else
			memory.active = false;
	}

};

MotivationClaimRoom.prototype.updateNeeds = function (roomName)
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
		}
	}
};

//-------------------------------------------------------------------------
// export
//-------------------------------------------------------------------------
module.exports = new MotivationClaimRoom();