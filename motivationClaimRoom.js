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
MotivationClaimRoom.prototype.getDemands = function (roomName) {
	let debug = false;
	let result = {};
	let unitName = this.getDesiredSpawnUnit(roomName);
	result.units = this.getUnitDemands(roomName);
	result.spawn = this.getDesireSpawn(roomName, result);
	lib.log(`  Claim Room Demands ${roomName} : ${unitName} : ${result.units[unitName]} Spawn: ${result.spawn}`, debug);
	Memory.rooms[roomName].motivations[this.name].demands = result;
	return result;
};

MotivationClaimRoom.prototype.getDesiredSpawnUnit = function ()
{
	return "claimer";
};

MotivationClaimRoom.prototype.getAssignableUnitNames = function ()
{
	return ["claimer"];
};

MotivationClaimRoom.prototype.getDesireSpawn = function (roomName, demands)
{
	let debug = false;
	let result = false;
	let room = Game.rooms[roomName];
	let numWorkers = creepManager.countHomeRoomUnits(roomName, "worker");
	let numClaimers = creepManager.countHomeRoomUnits(roomName, "claimer");

	// filter this to only claims spawning in specified room
	let spawnClaims = _.filter(Memory.claims, function (c){
		return c.spawnRoom === roomName;
	});

	lib.log(">&>&>&>&>&>&> getDesireSpawn: " + room.name
		+ " workers: " + numWorkers
		+ " spawn claims: " + _.size(spawnClaims)
		, debug);

	if (_.size(spawnClaims) === 0)
	{
		lib.log(">&>&>&>&>&>&> FAIL: Not my room", debug);
		return false;
	}

	if (_.size(spawnClaims) === 0)
	{
		lib.log(">&>&>&>&>&>&> FAIL: No claims", debug);
		return false;
	}

	// if it isn't our room or we have a worker shortage, false
	if (!room.getIsMine() || numWorkers < config.medWorkers)
	{
		lib.log(">&>&>&>&>&>&> FAIL: Too Few Workers", debug);
		return false;
	}

	if (numClaimers >= _.size(spawnClaims))
	{
		lib.log(">&>&>&>&>&>&> FAIL: Too many claimers", debug);
		return false;
	}

	// if this room is specified as spawn for another room, and the demanded units don't exist, true

	_.forEach(spawnClaims, function (c) {
		if (lib.isNull(Memory.rooms[c.room]))
		{
			Memory.rooms[c.room] = {};
		}
		//console.log(c.room + ": " + _.has(global, "cache.rooms." + c.room + ".units.claimer"));
		let numClaimers = creepManager.countRoomUnits(c.room, "claimer");
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
		if (!numClaimers && reservation < config.claimTicks) {
			result = true;
			lib.log(">&>&>&>&>&>&> SUCCESS", debug);
		}

		lib.log("Room: " + c.room + " COUNT: " + numClaimers + " TICKS: " + reservation, debug);
	});

	lib.log("Spawn claimer " + result, debug);
	return result;
};

/**
 * updateActive - this updates the active state of a motivation.
 * Make sure not to base anything on active state on something that is not updated for an inactive motivation. Like
 * demands.
 * @param roomName
 */
MotivationClaimRoom.prototype.updateActive = function (roomName)
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