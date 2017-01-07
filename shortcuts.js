/***********************************************************************************************************************
 * GLOBAL SHORTCUTS TO MAKE STUFF EASY!
 * NOTE: anything involving Game requires you to run it INSIDE
 * your main loop, as Game gets recreated each tick...
 **********************************************************************************************************************/

/**
 * Room shortcuts
 */
global.r1 = "W12S76";
global.r2 = "W13S77";
global.r3 = "W13S76";
global.r4 = "W12S77";

global.rl = roomLevels;
global.ws = wallStatus;

global.h1 = "harvester-1";
global.h2 = "harvester-2";
global.h3 = "harvester-3";
global.h4 = "harvester-4";
global.h5 = "harvester-5";
global.h6 = "harvester-6";
global.h7 = "harvester-7";
global.h8 = "harvester-8";
global.h9 = "harvester-9";
global.h10 = "harvester-10";
global.h11 = "harvester-11";
global.h12 = "harvester-12";
global.h13 = "harvester-13";
global.h14 = "harvester-14";
global.h15 = "harvester-15";
global.h16 = "harvester-16";
global.h17 = "harvester-17";
global.h18 = "harvester-18";
global.h19 = "harvester-19";
global.h20 = "harvester-20";

global.w1 = "worker-1";
global.w2 = "worker-2";
global.w3 = "worker-3";
global.w4 = "worker-4";
global.w5 = "worker-5";
global.w6 = "worker-6";
global.w7 = "worker-7";
global.w8 = "worker-8";
global.w9 = "worker-9";
global.w10 = "worker-10";
global.w11 = "worker-11";
global.w12 = "worker-12";
global.w13 = "worker-13";
global.w14 = "worker-14";
global.w15 = "worker-15";
global.w16 = "worker-16";
global.w17 = "worker-17";
global.w18 = "worker-18";
global.w19 = "worker-19";
global.w20 = "worker-20";
global.w21 = "worker-21";
global.w22 = "worker-22";
global.w23 = "worker-23";
global.w24 = "worker-24";
global.w25 = "worker-25";
global.w26 = "worker-26";
global.w27 = "worker-27";
global.w28 = "worker-28";
global.w29 = "worker-29";
global.w30 = "worker-30";

global.g1 = "guard-1";
global.g2 = "guard-2";
global.g3 = "guard-3";
global.g4 = "guard-4";
global.g5 = "guard-5";
global.g6 = "guard-6";
global.g7 = "guard-7";
global.g8 = "guard-8";
global.g9 = "guard-9";
global.g10 = "guard-10";

global.rg1 = "rangedGuard-1";
global.rg2 = "rangedGuard-2";
global.rg3 = "rangedGuard-3";
global.rg4 = "rangedGuard-4";
global.rg5 = "rangedGuard-5";
global.rg6 = "rangedGuard-6";
global.rg7 = "rangedGuard-7";
global.rg8 = "rangedGuard-8";
global.rg9 = "rangedGuard-9";
global.rg10 = "rangedGuard-10";

global.h1 = "healer-1";
global.h2 = "healer-2";
global.h3 = "healer-3";
global.h4 = "healer-4";
global.h5 = "healer-5";
global.h6 = "healer-6";
global.h7 = "healer-7";
global.h8 = "healer-8";
global.h9 = "healer-9";
global.h10 = "healer-10";
// ---------------------------------------------------------------------------------------------------------------------
// Creep assignment ----------------------------------------------------------------------------------------------------

/**
 * permanently assign a creep to a room
 * @param creepName
 * @param roomName
 */
global.cRoom = function(creepName, roomName)
{
	Game.creeps[creepName].deassignMotive(roomName);
	Game.creeps[creepName].memory.motive.room = roomName;
	Game.creeps[creepName].memory.motive.motivation = "";
	Game.creeps[creepName].memory.motive.need = "";
};

/**
 * temporarily assigns a creep to a room
 * @param creepName
 * @param roomName
 */
global.cTRoom = function(creepName, roomName)
{
	Game.creeps[creepName].memory.motive.room = roomName;
	Game.creeps[creepName].memory.motive.motivation = "";
	Game.creeps[creepName].memory.motive.need = "";
};

// force spawn ---------------------------------------------------------------------------------------------------------
global.fs = function (roomName, unit)
{
	if (!lib.isNull(unit))
	{
		Memory.rooms[roomName].forceSpawn = unit;
		return "Force Spawn for " + roomLink(roomName) + " set to : " + unit;
	} else {
		return "Force Spawn for " + roomLink(roomName) + " is : " + Memory.rooms[roomName].forceSpawn;
	}
};

// claims --------------------------------------------------------------------------------------------------------------

/**
 * list the current claims
 */
global.qList = function ()
{
	let claims = Memory.claims;
	let outputString = "";

	// build output
	outputString = "\n--- Current Claims ---\n";
	_.forEach(claims, function (claim)
	{
		let unclaimCommand = "qUnclaim('" + claim.room + "')";
		let buttonUnclaim = makeButton(getId() , undefined , "Unclaim" , unclaimCommand);
		let buttonToggle = "";
		let toggleCommand = "";

		if (claim.type === "reserve")
		{
			toggleCommand = "qClaim('" + claim.room + "','" + claim.spawnRoom + "','claim')";
			buttonToggle = makeButton(getId() , undefined , "Claim" , toggleCommand);
		} else if (claim.type === "claim")
		{
			toggleCommand = "qClaim('" + claim.room + "','" + claim.spawnRoom + "','reserve')";
			buttonToggle = makeButton(getId() , undefined , "Reserve" , toggleCommand);
		}

		outputString += `\troom: ${roomLink(claim.room)}\tspawn: ${roomLink(claim.spawnRoom)}\ttype: ${claim.type}\t${buttonUnclaim}\t${buttonToggle}\n`;
	});

	// output
	console.log(outputString);
};

/**
 * set or update an existing claim
 * @param roomName
 * @param spawnRoom
 * @param claimType
 * @returns {*}
 */
global.qClaim = function (roomName, spawnRoom, claimType)
{
	let claims = Memory.claims;
	let claim = _.find(claims, function (c)
	{
		return c.room === roomName;
	});

	if (lib.isNull(roomName) || lib.isNull(spawnRoom) || lib.isNull(claimType))
		return "Missing argument(s). - roomName, spawnRoom, claimType";


	if (lib.isNull(claim))
	{
		claims.push({ "room": roomName, "spawnRoom": spawnRoom, "type": claimType });
		return "New claim added.";
	} else {
		claim.spawnRoom = spawnRoom;
		claim.type = claimType;
		return "Claim updated."
	}
};

/**
 * remove a claim
 * @param roomName
 */
global.qUnclaim = function (roomName)
{
	let claims = Memory.claims;
	let claim = _.find(claims, function (c)
	{
		return c.room === roomName;
	});

	if (lib.isNull(claim))
	{
		return "Unable to find claim to remove.";
	} else {
		let index = claims.indexOf(claim);
		claims.splice(index, 1);
		return "Claim removed."
	}
};

// long range harvest --------------------------------------------------------------------------------------------------
global.lList = function ()
{
	let outputString = "\n--- Current Long Distance Harvest Targets ---\n";
	outputString += "\tRoom\n";
	_.forEach(Memory.longDistanceHarvestTargets, function (target)
	{
		let button;
		let buttonCommand = "lRemove('" + target + "')";
		let link = roomLink(target);

		button = makeButton(getId() , undefined , "Stop Harvesting" , buttonCommand);
		outputString += `\troom: ${link}\t ${button}\n`;
	});

	console.log(outputString);
};

global.lAdd = function (roomName)
{
	let targets = Memory.longDistanceHarvestTargets;
	let target = _.find(targets, function (c)
	{
		return c === roomName;
	});

	if (lib.isNull(roomName))
		return "Missing argument(s). - roomName, spawnRoom, claimType";


	if (lib.isNull(target))
	{
		targets.push(roomName);
		return "New target added.";
	} else {
		return "Target exists."
	}
};

global.lRemove = function (roomName)
{
	let targets = Memory.longDistanceHarvestTargets;
	let target = _.find(targets, function (c)
	{
		return c === roomName;
	});

	if (lib.isNull(target))
	{
		return "Unable to find target to remove.";
	} else {
		let index = targets.indexOf(target);
		targets.splice(index, 1);
		return "Target removed."
	}
};

// manual tactical -----------------------------------------------------------------------------------------------------
global.mtList = function ()
{
	let rooms = Memory.rooms;
	let outputString = "";

	// build output
	outputString = "\n--- Manual Tactical Mode ---\n";
	_.forEach(rooms, function (roomMemory, roomName)
	{
		if (!lib.isNull(roomMemory.motivations))
		{
			let state = roomMemory.motivations["motivationManualTactical"].active;
			let buttonToggle = "";
			let toggleCommand = "";

			if (!state)
			{
				toggleCommand = "mt('" + roomName + "',true)";
				buttonToggle = makeButton(getId() , undefined , "Enable" , toggleCommand);
			}
			else
			{
				toggleCommand = "mt('" + roomName + "',false)";
				buttonToggle = makeButton(getId() , undefined , "Disable" , toggleCommand);
			}

			outputString += `\troom: ${roomLink(roomName)}\tenabled: ${state}\t${buttonToggle}\n`;
		}
	});

	// output
	console.log(outputString);
};

global.mt = function (roomName, state)
{
	let roomMemory = Memory.rooms[roomName];
	// toggle
	if (lib.isNull(state))
	{
		if (roomMemory.motivations["motivationManualTactical"].active === true)
		{
			roomMemory.motivations["motivationManualTactical"].active = false;
			state = false;
		}
		else
		{
			roomMemory.motivations["motivationManualTactical"].active = true;
			state = true;
		}
	}
	else
	{
		roomMemory.motivations["motivationManualTactical"].active = state;
	}

	if (state)
		return roomName + " set active.";
	else
		return roomName + " set inactive.";
};

// room manager --------------------------------------------------------------------------------------------------------
global.rmList = function ()
{
	let rooms = Memory.rooms;
	let outputString = "";

	// build output
	outputString = "--- Room Manager ---\n";

	// Headings
	outputString += `\tRoom\tVisible\tMine\tManTac\n`;

	// loop over rooms
	_.forEach(rooms, function (roomMemory, roomName)
	{
		if (!lib.isNull(roomMemory) && roomName != undefined)
		{
			let room = Game.rooms[roomName];

			// visible
			let visible = !lib.isNull(room);

			// mine
			let mine = !lib.isNull(room) && !lib.isNull(room.controller) && (!lib.isNull(room.controller.my) && room.controller.my);

			// Manual Tactical

			let buttonManTac = "";

			if (!lib.isNull(roomMemory.motivations))
			{
				let manTacCommand = "";
				let state = roomMemory.motivations["motivationManualTactical"].active;

				if (!state)
				{
					manTacCommand = "mt('" + roomName + "',true)";
					buttonManTac = makeButton(getId() , undefined , "Enable" , manTacCommand);
				}
				else
				{
					manTacCommand = "mt('" + roomName + "',false)";
					buttonManTac = makeButton(getId() , undefined , "Disable" , manTacCommand);
				}
			}
			else
			{
				buttonManTac = "N/A";
			}

			// row
			outputString += `\t${roomLink(roomName)}\t${visible}\t${mine}\t${buttonManTac}\n`;
		}
	});

	// output
	console.log(outputString);
};

/*
* All of the code below here was provided by guys on the screeps slack.
* If you haven't checked that out, do so now, it is awesome.
* Huge props to all the guys for sharing this!
 */

// profiler ------------------------------------------------------------------------------------------------------------
if(Game.profiler){
	global.p = Game.profiler;
	global.o = Game.profiler.output;
	global.rb = function(){
		Game.profiler.reset();
		Game.profiler.background();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// credit due for next line to warinternal
global.ex = (x) => JSON.stringify(x, null, 2);

// game object shortcuts -----------------------------------------------------------------------------------------------
global.g = {
	c: global.gc = Game.creeps,
	f: global.gf = Game.flags,
	s: global.gs = Game.spawns,
	r: global.gr = Game.rooms,
	m: global.gm = Game.market,
};

global.goid = Game.getObjectById;

global.r = function r(rName){ return gr[rName];};

global.total = function(){
	return Object.keys(Game.creeps).length;
};

global.LOGGING_ENABLED = true;
global.logging = function(bool){global.LOGGING_ENABLED = bool};
global.log = {
	log:   function log  (arg){if(global.LOGGING_ENABLED)return console.log(arg)},
	warn:  function warn (arg){if(global.LOGGING_ENABLED)return console.log('<span style=color:#FFBF3F>'+arg+'</span>');},
	err:   function err  (arg){if(global.LOGGING_ENABLED)return console.log('<span style=color:#D18F98>'+arg+'</span>');},
	error: function error(arg){if(global.LOGGING_ENABLED)return console.log('<span style=color:#D18F98>'+arg+'</span>');},
};

// to be used after you respawn into a new location
//   but before you spawn your first creep...
global.respawn = function(){
	for(let f in Game.flags){
		Game.flags[f].remove();
	}
	Memory = {};
	RawMemory.set('');
};

global.errName = function(err){
	switch(err){
		case ERR_NOT_OWNER: return 'ERR_NOT_OWNER';
		case ERR_NO_PATH: return 'ERR_NO_PATH';
		case ERR_NAME_EXISTS: return 'ERR_NAME_EXISTS';
		case ERR_BUSY: return 'ERR_BUSY';
		case ERR_NOT_FOUND: return 'ERR_NOT_FOUND';
		case ERR_NOT_ENOUGH_RESOURCES: return 'ERR_NOT_ENOUGH_ENERGY/ERR_NOT_ENOUGH_RESOURCES/ERR_NOT_ENOUGH_EXTENSIONS';
		case ERR_INVALID_TARGET: return 'ERR_INVALID_TARGET';
		case ERR_FULL: return 'ERR_FULL';
		case ERR_NOT_IN_RANGE: return 'ERR_NOT_IN_RANGE';
		case ERR_INVALID_ARGS: return 'ERR_INVALID_ARGS';
		case ERR_TIRED: return 'ERR_TIRED';
		case ERR_NO_BODYPART: return 'ERR_NO_BODYPART';
		case ERR_RCL_NOT_ENOUGH: return 'ERR_RCL_NOT_ENOUGH';
		case ERR_GCL_NOT_ENOUGH: return 'ERR_GCL_NOT_ENOUGH';
	}
	return '';
};

// Courtesy of proximo, Dec 9 2016
global.REVERSE_DIR = {
	[TOP]            : BOTTOM,
	[TOP_RIGHT]        : BOTTOM_LEFT,
	[RIGHT]            : LEFT,
	[BOTTOM_RIGHT]    : TOP_LEFT,
	[BOTTOM]        : TOP,
	[BOTTOM_LEFT]    : TOP_RIGHT,
	[LEFT]            : RIGHT,
	[TOP_LEFT]        : BOTTOM_RIGHT
};
