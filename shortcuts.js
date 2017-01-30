/***********************************************************************************************************************
 * GLOBAL SHORTCUTS TO MAKE STUFF EASY!
 **********************************************************************************************************************/

/**
 * Room shortcuts
 */
global.r1 = "W12S76";
global.r2 = "W13S77";
global.r3 = "W11S79";
global.l1 = "W13S76";
global.l2 = "W12S77";
global.l3 = "W14S77";
global.l4 = "W13S78";
global.l5 = "W12S79";
global.rM = "W12S78";

global.rl = roomLevels;
global.ws = wallStatus;

// ---------------------------------------------------------------------------------------------------------------------
// Creep assignment ----------------------------------------------------------------------------------------------------

/**
 * permanently assign a creep to a room
 * @param creepName
 * @param roomName
 */
global.croom = function (creepName , roomName)
{
	Game.creeps[creepName].deassignMotive(roomName);
	Game.creeps[creepName].memory.homeRoom = roomName;
};

/**
 * temporarily assigns a creep to a room
 * @param creepName
 * @param roomName
 */
global.ctroom = function (creepName , roomName)
{
	Game.creeps[creepName].deassignMotive(roomName);
};

global.cassign = function (creepName , roomName , motivationName , needName)
{
	Game.creeps[creepName].assignMotive(roomName , motivationName , needName);
};

global.clist = function (roomName)
{
	let output = "";

	if (lib.isNull(Memory.rooms[roomName]))
	{
		return `Room: ${roomName} not found in memory.`;
	}

	output += `\n-- Creeps for ${roomName}`;
	_.forEach(Memory.rooms[roomName].resources.units , function (c , k)
	{
		output += `\n${k}\n\ttotal: ${c.total}\tallocated: ${c.allocated}\tunallocated: ${c.unallocated}\tassigned: ${c.assigned}\tunassigned: ${c.unassigned}`;
	});

	return output;
};

// force spawn ---------------------------------------------------------------------------------------------------------
global.fs = function (roomName , unit)
{
	if (lib.isNull(roomName) || lib.isNull(unit))
	{
		return "fs - forceSpawn arguments roomName, unit";
	}
	if (lib.isNull(Memory.rooms[roomName]))
	{
		return "Room " + roomName + " not found.";
	}
	if (!lib.isNull(unit))
	{
		Memory.rooms[roomName].forceSpawn = unit;
		return "Force Spawn for " + roomLink(roomName) + " set to : " + unit;
	}
	else
	{
		return "Force Spawn for " + roomLink(roomName) + " is : " + Memory.rooms[roomName].forceSpawn;
	}
};

// claims --------------------------------------------------------------------------------------------------------------

/**
 * list the current claims
 */
global.qlist = function ()
{
	let claims = Memory.claims;
	let outputString = "";

	// build output
	outputString = "\n--- Current Claims ---\n";
	_.forEach(claims , function (claim)
	{
		let unclaimCommand = "qunclaim('" + claim.room + "')";
		let buttonUnclaim = makeButton(getId() , undefined , "Unclaim" , unclaimCommand);
		let buttonToggle = "";
		let toggleCommand = "";

		if (claim.type === "reserve")
		{
			toggleCommand = "qclaim('" + claim.room + "','" + claim.spawnRoom + "','claim')";
			buttonToggle = makeButton(getId() , undefined , "Claim" , toggleCommand);
		}
		else if (claim.type === "claim")
		{
			toggleCommand = "qclaim('" + claim.room + "','" + claim.spawnRoom + "','reserve')";
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
global.qclaim = function (roomName , spawnRoom , claimType)
{
	let claims = Memory.claims;
	let claim = _.find(claims , function (c)
	{
		return c.room === roomName;
	});

	if (lib.isNull(roomName) || lib.isNull(spawnRoom) || lib.isNull(claimType))
	{
		return "Missing argument(s). - roomName, spawnRoom, claimType";
	}

	if (lib.isNull(claim))
	{
		claims.push({"room": roomName , "spawnRoom": spawnRoom , "type": claimType});
		return "New claim added.";
	}
	else
	{
		claim.spawnRoom = spawnRoom;
		claim.type = claimType;
		return "Claim updated."
	}
};

/**
 * remove a claim
 * @param roomName
 */
global.qunclaim = function (roomName)
{
	let claims = Memory.claims;
	let claim = _.find(claims , function (c)
	{
		return c.room === roomName;
	});

	if (lib.isNull(claim))
	{
		return "Unable to find claim to remove.";
	}
	else
	{
		let index = claims.indexOf(claim);
		claims.splice(index , 1);
		return "Claim removed."
	}
};

// long range harvest --------------------------------------------------------------------------------------------------
global.llist = function ()
{
	let outputString = "\n--- Current Long Distance Harvest Targets ---";
	let button , buttonCommand , link;

	_.forEach(Memory.rooms , function (r , k)
	{
		if (lib.isNull(r.longDistanceHarvestTargets))
		{
			r.longDistanceHarvestTargets = [];
		}
		if (lib.isNull(r.longDistanceHarvestParents))
		{
			r.longDistanceHarvestParents = [];
		}

		link = roomLink(k);
		outputString += `\nSource Room: ${link}`;
		_.forEach(r.longDistanceHarvestTargets , function (target)
		{
			buttonCommand = "lremove('" + target + "','" + k + "')";
			link = roomLink(target);
			button = makeButton(getId() , undefined , "Stop Harvesting" , buttonCommand);
			outputString += `\n\troom: ${link}\t ${button}\n`;
		});
		if (r.longDistanceHarvestTargets.length === 0)
		{
			outputString += `\n\tNo targets.`;
		}
	});

	return outputString;
};

global.ladd = function (targetRoomName, sourceRoomName)
{
	if (lib.isNull(sourceRoomName) || lib.isNull(targetRoomName))
	{
		return "Missing argument(s). - targetRoomName, sourceRoomName";
	}
	if (lib.isNull(Memory.rooms[sourceRoomName]))
	{
		return "Missing source room: " + sourceRoomName;
	}

	if (lib.isNull(Memory.rooms[targetRoomName].longDistanceHarvestTargets))
	{
		Memory.rooms[targetRoomName].longDistanceHarvestTargets = [];
	}
	if (lib.isNull(Memory.rooms[targetRoomName].longDistanceHarvestParents))
	{
		Memory.rooms[targetRoomName].longDistanceHarvestParents = [];
	}

	let targets = Memory.rooms[sourceRoomName].longDistanceHarvestTargets;
	let parents = Memory.rooms[targetRoomName].longDistanceHarvestParents;
	let target = _.find(targets , function (c)
	{
		return c === targetRoomName;
	});

	if (lib.isNull(target))
	{
		targets.push(targetRoomName);
		parents.push(sourceRoomName);
		return "New target added.";
	}
	else
	{
		return "Target exists."
	}
};

global.lremove = function (targetRoomName, sourceRoomName)
{
	let result = "";
	if (lib.isNull(sourceRoomName) || lib.isNull(targetRoomName))
	{
		return "Missing argument(s). - targetRoomName, sourceRoomName";
	}
	if (lib.isNull(Memory.rooms[sourceRoomName]))
	{
		return "Missing source room: " + sourceRoomName;
	}

	let targets = Memory.rooms[sourceRoomName].longDistanceHarvestTargets;
	let parents = Memory.rooms[targetRoomName].longDistanceHarvestParents;
	let target = _.find(targets , function (c)
	{
		return c === targetRoomName;
	});

	let parent = _.find(parents , function (c)
	{
		return c === sourceRoomName;
	});

	if (lib.isNull(target))
	{
		result = "Unable to find target to remove.";
	}
	else
	{
		let index = targets.indexOf(target);
		targets.splice(index , 1);
		result = "Target removed."
	}

	if (lib.isNull(parent))
	{
		return "Unable to find parent to remove.";
	}
	else
	{
		let index = parents.indexOf(parent);
		parents.splice(index , 1);
		result = "Parent removed."
	}

	return result;
};

// scout ---------------------------------------------------------------------------------------------------------------
global.slist = function ()
{
	let outputString = "\n--- Current Scout Targets ---";
	let button , buttonCommand;

	_.forEach(Memory.scoutTargets , function (scoutTarget)
	{
		outputString += `\nTarget Room: ${roomLink(scoutTarget.targetRoom)}`;
		outputString += `\tSource Room: ${roomLink(scoutTarget.sourceRoom)}`;
		outputString += `\tInterval: ${scoutTarget.scoutInterval}`;
		outputString += `\tLast Seen: ${Game.time - scoutTarget.lastSeen}`;

		buttonCommand = "sremove('" + scoutTarget.targetRoom + "','" + scoutTarget.sourceRoom + "')";
		button = makeButton(getId() , undefined , "Stop Scouting" , buttonCommand);
		outputString += `\t${button}`;
	});
	if (_.size(Memory.scoutTargets) < 1)
	{
		outputString += `\n\tNo scout targets.`;
	}

	return outputString;
};

global.sadd = function (targetRoomName, sourceRoomName, scoutInterval = 0)
{
	// validate input
	if (lib.isNull(targetRoomName) || lib.isNull(sourceRoomName))
	{
		return "Missing argument(s). - targetRoomName, sourceRoomName, scoutInterval = 0";
	}
	if (lib.isNull(Memory.rooms[sourceRoomName]))
	{
		return "Missing source room: " + sourceRoomName;
	}

	// declarations
	let scoutTarget = _.find(Memory.scoutTargets , {targetRoom: targetRoomName, sourceRoom: sourceRoomName});

	if (lib.isNull(Memory.rooms[targetRoomName]))
	{
		Memory.rooms[targetRoomName] = {};
		Memory.rooms[targetRoomName].cache = {};
		console.log(`Creating memory for ${targetRoomName}`);
	}

	// implementation
	if (lib.isNull(scoutTarget))
	{
		scoutTarget = {};
		scoutTarget.targetRoom = targetRoomName;
		scoutTarget.sourceRoom = sourceRoomName;
		scoutTarget.scoutInterval = scoutInterval;
		scoutTarget.lastSeen = 0;
		Memory.scoutTargets.push(scoutTarget);
		return "New target added.";
	}
	else
	{
		return "Target exists."
	}


};

global.sremove = function (targetRoomName, sourceRoomName)
{
	let result = "";
	if (lib.isNull(sourceRoomName) || lib.isNull(targetRoomName))
	{
		return "Missing argument(s). - targetRoomName, sourceRoomName";
	}
	if (lib.isNull(Memory.rooms[sourceRoomName]))
	{
		return "Missing source room: " + sourceRoomName;
	}

	let scoutTarget = _.find(Memory.scoutTargets , {targetRoom: targetRoomName, sourceRoom: sourceRoomName});

	if (lib.isNull(scoutTarget))
	{
		result = "Unable to find target to remove.";
	}
	else
	{
		let index = Memory.scoutTargets.indexOf(scoutTarget);
		Memory.scoutTargets.splice(index , 1);
		result = "Target removed."
	}

	return result;
};

// manual tactical -----------------------------------------------------------------------------------------------------

// room manager --------------------------------------------------------------------------------------------------------
global.rmlist = function ()
{
	let rooms = Memory.rooms;
	let outputString = "";

	// build output
	outputString = "--- Room Manager ---\n";

	// Headings
	outputString += `\tRoom\tVisible\tMine\tManTac\n`;

	// loop over rooms
	_.forEach(rooms , function (roomMemory , roomName)
	{
		if (!lib.isNull(roomMemory) && roomName != undefined)
		{
			let room = Game.rooms[roomName];

			// visible
			let visible = !lib.isNull(room);

			// mine
			let mine = room.getIsMine();

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

global.mlist = function (roomName)
{
	let output = "";
	let sortedMotivations = [];

	if (lib.isNull(Memory.rooms[roomName]))
	{
		return `Room: ${roomName} not found in memory.`;
	}

	sortedMotivations = _.sortByOrder(Memory.rooms[roomName].motivations , ['priority'] , ['desc']);

	output += `\n-- Motivations for ${roomName}`;
	_.forEach(sortedMotivations , function (motivation)
	{
		output += `\n${motivation.name}\n\tactive: ${motivation.active}\tdemand spawn:${motivation.demands.spawn}\tspawn allocated: ${motivation.spawnAllocated}\t unit: ${global[motivation.name].getDesiredSpawnUnit(roomName)}`;
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
global.ex = (x) => JSON.stringify(x , null , 2);

// game object shortcuts -----------------------------------------------------------------------------------------------
global.g = {
	c: global.gc = Game.creeps ,
	f: global.gf = Game.flags ,
	s: global.gs = Game.spawns ,
	r: global.gr = Game.rooms ,
	m: global.gm = Game.market ,
};

global.goid = Game.getObjectById;

global.r = function r (rName)
{
	return gr[rName];
};

global.total = function ()
{
	return Object.keys(Game.creeps).length;
};

//profiler
//global.p = Game.profiler;
//global.pp = Game.profiler.profile;
//global.ps = Game.profiler.stream;
//global.pe = Game.profiler.email;
//global.pb = Game.profiler.background;

// Output current profile data.
//global.po = Game.profiler.output;

// Reset the profiler, disabling any profiling in the process.
//global.pr = Game.profiler.reset;
//global.prs = Game.profiler.restart;

// to be used after you respawn into a new location
//   but before you spawn your first creep...
global.respawn = function ()
{
	for (let f in Game.flags)
	{
		Game.flags[f].remove();
	}
	Memory = {};
	RawMemory.set('');
};
