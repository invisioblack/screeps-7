/***********************************************************************************************************************
 * GLOBAL SHORTCUTS TO MAKE STUFF EASY!
 **********************************************************************************************************************/
"use strict";

/**
 * Room shortcuts
 */
global.r1 = "W12S76";
global.r2 = "W13S77";
global.r3 = "W13S76";
global.r4 = "W12S77";
global.r5 = "W14S77";

global.rl = roomLevels;
global.ws = wallStatus;

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
	Game.creeps[creepName].memory.homeRoom = roomName;
};

/**
 * temporarily assigns a creep to a room
 * @param creepName
 * @param roomName
 */
global.cTRoom = function(creepName, roomName)
{
	Game.creeps[creepName].deassignMotive(roomName);
};


global.cAssign = function (creepName, roomName, motivationName, needName)
{
	Game.creeps[creepName].assignMotive(roomName, motivationName, needName);
};

global.cList = function (roomName)
{
	let output = "";

	if (lib.isNull(Memory.rooms[roomName]))
	{
		return `Room: ${roomName} not found in memory.`;
	}

	output += `\n-- Creeps for ${roomName}`;
	_.forEach(Memory.rooms[roomName].resources.units, function (c, k) {
		output += `\n${k}\n\ttotal: ${c.total}\tallocated: ${c.allocated}\tunallocated: ${c.unallocated}\tassigned: ${c.assigned}\tunassigned: ${c.unassigned}`;
	});

	return output;
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
	let outputString = "\n--- Current Long Distance Harvest Targets ---";
	let button, buttonCommand, link;

	_.forEach(Memory.rooms, function (r, k) {
		if (lib.isNull(r.longDistanceHarvestTargets))
			r.longDistanceHarvestTargets = [];

		link = roomLink(k);
		outputString += `\nSource Room: ${link}`;
		_.forEach(r.longDistanceHarvestTargets, function (target)
		{
			buttonCommand = "lRemove('" + k + "','" + target + "')";
			link = roomLink(target);
			button = makeButton(getId() , undefined , "Stop Harvesting" , buttonCommand);
			outputString += `\n\troom: ${link}\t ${button}\n`;
		});
		if (r.longDistanceHarvestTargets.length === 0)
			outputString += `\n\tNo targets.`;
	});


	return outputString;
};

global.lAdd = function (sourceRoomName, targetRoomName)
{
	if (lib.isNull(sourceRoomName) || lib.isNull(targetRoomName))
		return "Missing argument(s). - sourceRoomName, targetRoomName";
	if (lib.isNull(Memory.rooms[sourceRoomName]))
		return "Missing source room: " + sourceRoomName;

	let targets = Memory.rooms[sourceRoomName].longDistanceHarvestTargets;
	let target = _.find(targets, function (c)
	{
		return c === targetRoomName;
	});

	if (lib.isNull(target))
	{
		targets.push(targetRoomName);
		return "New target added.";
	} else {
		return "Target exists."
	}
};

global.lRemove = function (sourceRoomName, targetRoomName)
{
	if (lib.isNull(sourceRoomName) || lib.isNull(targetRoomName))
		return "Missing argument(s). - sourceRoomName, targetRoomName";
	if (lib.isNull(Memory.rooms[sourceRoomName]))
		return "Missing source room: " + sourceRoomName;

	let targets = Memory.rooms[sourceRoomName].longDistanceHarvestTargets;
	let target = _.find(targets, function (c)
	{
		return c === targetRoomName;
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

/***********************************************************************************************************************
 * Motivation display/management
 */

global.mList = function (roomName)
{
	let output = "";
	let sortedMotivations = [];

	if (lib.isNull(Memory.rooms[roomName]))
	{
		return `Room: ${roomName} not found in memory.`;
	}

	sortedMotivations = _.sortByOrder(Memory.rooms[roomName].motivations , ['priority'] , ['desc']);

	output += `\n-- Motivations for ${roomName}`;
	_.forEach(Memory.rooms[roomName].motivations, function (motivation) {
		output += `\n${motivation.name}\n\tactive: ${motivation.active}\tdemand spawn:${motivation.demands.spawn}\tspawn allocated: ${motivation.spawnAllocated}`;
	});

	return output;
};


/*
* All of the code below here was provided by guys on the screeps slack.
* If you haven't checked that out, do so now, it is awesome.
* Huge props to all the guys for sharing this!
 */
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

// to be used after you respawn into a new location
//   but before you spawn your first creep...
global.respawn = function(){
	for(let f in Game.flags){
		Game.flags[f].remove();
	}
	Memory = {};
	RawMemory.set('');
};
