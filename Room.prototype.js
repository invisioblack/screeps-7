//-------------------------------------------------------------------------
// Room.prototype
//-------------------------------------------------------------------------

/***********************************************************************************************************************
 * management functions
 */

/**
 * Insure all memory is setup for a room
 */
Room.prototype.init = function ()
{
	let reservation = {};
	reservation.time = Game.time;

	if(lib.isNull(this.memory.longDistanceHarvestTargets))
	{
		this.memory.longDistanceHarvestTargets = [];
	}

	if (!lib.isNull(this.controller) && !lib.isNull(this.controller.reservation)) {
		if (this.controller.reservation.username === C.ME)
		{
			reservation.tickToEnd = this.controller.reservation.ticksToEnd;
		} else
			reservation.tickToEnd = 0;
	} else {
		reservation.tickToEnd = 0;
	}

	this.memory.reservation = reservation;
};

Room.prototype.initMemCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache) || forceRefresh)
	{
		this.memory.cache = {};
		forceRefresh = true;
	}

	this.updateStructureCache(forceRefresh);
	this.updateSourceCache(forceRefresh);
	this.updateDroppedCache(forceRefresh);
	this.updateUnitCache();
	this.updateFlagCache(forceRefresh);
};

/**
 * Updates the memory structure cache to reduce the number of Room.find() calls for structures
 */
Room.prototype.updateStructureCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.structures))
	{
		this.memory.cache.structures = {};
		forceRefresh = true;
	}

	if (Game.time % 10 === 0)
		forceRefresh = true;

	if (forceRefresh)
	{
		let structures = this.memory.cache.structures;
		let roomLevel = this.getControllerLevel();
		let room = this;

		_.forEach(STRUCTURES , function (s)
		{
			//console.log(`Type: ${s} Level: ${roomLevel}`);
			if (!lib.isNull(CONTROLLER_STRUCTURES[s]) && CONTROLLER_STRUCTURES[s][roomLevel] >= 0)
			{
				//console.log(`Checking ${s}...`);
				let foundStructures = room.find(FIND_STRUCTURES , { filter: function (st)
				{
					return st.structureType === s;
				}});
				//console.log(`Found ${foundStructures}...`);


				// map structure ids to the memory object
				structures[s] = _.map(foundStructures, function (st) {
					return st.id;
				});
			}
		});

		structures[STRUCTURE_ALL_NOWALL] = _.map(
			room.find(FIND_STRUCTURES, {
				filter: (s) => {
					return s.structureType != STRUCTURE_WALL
						&& s.structureType != STRUCTURE_RAMPART
				}
			}), (o) => { return o.id });
		structures[STRUCTURE_ALL_WALL] = _.map(
			room.find(FIND_STRUCTURES, {
				filter: (s) => {
					return s.structureType === STRUCTURE_WALL
						|| s.structureType === STRUCTURE_RAMPART
				}
			}), (o) => { return o.id });
	}
};

Room.prototype.updateSourceCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.sources))
	{
		this.memory.cache.sources = {};
		forceRefresh = true;
	}

	if (Game.time % 100 === 0)
		forceRefresh = true;

	if (forceRefresh)
	{
		let foundSources = this.find(FIND_SOURCES);
		//console.log(`Found: ${foundSources}`);

		// map structure ids to the memory object
		this.memory.cache.sources = _.map(foundSources, function (s) {
			return s.id;
		});
		//console.log(`Result ${this.memory.cache.sources}`);
	}
};

Room.prototype.updateDroppedCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.dropped))
	{
		this.memory.cache.dropped = {};
		forceRefresh = true;
	}

	if (Game.time % 2 === 0)
		forceRefresh = true;

	if (forceRefresh)
	{
		let foundDropped = this.find(FIND_DROPPED_RESOURCES);
		//console.log(`Found: ${foundDropped}`);

		// map structure ids to the memory object
		this.memory.cache.dropped = _.map(foundDropped, function (s) {
			return s.id;
		});
		//console.log(`Result ${this.memory.cache.sources}`);
	}
};

/**
 * This is a room based unit cache that lives for the duration of one tick in global
 */
Room.prototype.updateUnitCache = function ()
{
	let roomCreeps = creepManager.getRoomCreeps(this.name);
	let roomName = this.name;
	global.cache.rooms[roomName] = {};
	global.cache.rooms[roomName].creeps = roomCreeps;
	global.cache.rooms[roomName].units = _.groupBy(roomCreeps, (o) => {
		return o.memory.unit;
	} );

	_.forEach(units, (v, k)=> {
		if (lib.isNull(global.cache.rooms[roomName].units[k]))
		{
			global.cache.rooms[roomName].units[k] = [];
		}
	});

	roomCreeps = _.filter(Game.creeps, (c) => c.memory.homeRoom === roomName);
	if (lib.isNull(global.cache.homeRooms))
		global.cache.homeRooms = {};
	global.cache.homeRooms[roomName] = {};
	global.cache.homeRooms[roomName].creeps = roomCreeps;
	global.cache.homeRooms[roomName].units = _.groupBy(roomCreeps, (o) => {
		return o.memory.unit;
	} );

	_.forEach(units, (v, k)=> {
		if (lib.isNull(global.cache.homeRooms[roomName].units[k]))
		{
			global.cache.homeRooms[roomName].units[k] = [];
		}
	});

	/*
	let output = "";
	_.forEach(global.cache.homeRooms, (v, k) => {
		output += `\nRoom: ${k}`;
		output += `\n\tCreeps: ${JSON.stringify(v)}`;
		_.forEach(v.units, (sv, sk) => {
			output += `\n\tUnit: ${sk}: ${sv}`;
		});
	});
	console.log(output);
	*/
};

Room.prototype.updateFlagCache = function (forceRefresh = false)
{
	let roomName = this.name;
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.flags))
	{
		this.memory.cache.flags = {};
		forceRefresh = true;
	}

	if (Game.time % 5 === 0)
		forceRefresh = true;

	if (forceRefresh)
	{
		let foundFlags = this.find(FIND_FLAGS, { filter: (f) => { return f.room.name === roomName;}});
		let flagNames = _.map(foundFlags, (f) => { return f.name});
		//console.log(`Found: ${foundFlags}`);

		// map structure ids to the memory object
		this.memory.cache.flags = flagNames;
		//console.log(`Result ${JSON.stringify(this.memory.cache.flags)}`);
	}
};


/**
 * This function updates the state of the energy pickup mode for this room. This is how creeps who need energy will go
 * about acquiring it.
 */
Room.prototype.updateEnergyPickupMode = function ()
{

	result = C.ROOM_ENERGYPICKUPMODE_NOENERGY;
	if (this.memory.cache.sources.length > 0)
	{
		result = C.ROOM_ENERGYPICKUPMODE_HARVEST;

		let roomName = this.name;
		let numContainers = lib.nullProtect(this.memory.cache.structures[STRUCTURE_CONTAINER], []).length;
		let numStorage = lib.nullProtect(this.memory.cache.structures[STRUCTURE_STORAGE], []).length;
		let numLink = lib.nullProtect(this.memory.cache.structures[STRUCTURE_LINK], []).length;
		let containers = _.map(this.memory.cache.structures[STRUCTURE_CONTAINER], function (cid) {
			return Game.getObjectById(cid);
		});
		let containerEnergy = _.sum(containers, function (c) {
			return c.store[RESOURCE_ENERGY];
		});

		let numHarvesters = _.has(global, "cache.rooms." + roomName + ".units.harvester") ? global.cache.rooms[roomName].units["harvester"].length : 0;
		let numHaulers = _.has(global, "cache.rooms." + roomName + ".units.hauler") ? global.cache.rooms[roomName].units["hauler"].length : 0;

		if (numContainers >= this.memory.cache.sources.length && (containerEnergy > 0 || numHarvesters > 0))
		{
			result = C.ROOM_ENERGYPICKUPMODE_CONTAINER;
		}

		if (numStorage > 0)
		{
			if (numHarvesters > 0 && numHaulers > 0)
				result = C.ROOM_ENERGYPICKUPMODE_STORAGE;
			else
			{
				let storage = Game.getObjectById(this.memory.cache.structures[STRUCTURE_STORAGE][0]);
				if (storage.store[RESOURCE_ENERGY] > 0)
					result = C.ROOM_ENERGYPICKUPMODE_STORAGE;
			}
		}

		if (numLink > 1 && numHaulers > 0)
		{
			result = C.ROOM_ENERGYPICKUPMODE_LINK;
		}
	}

	this.memory.energyPickupMode = result;
	return result;
};

Room.prototype.motivateLinks = function ()
{
	if (this.getIsMine())
	{
		// find all towers
		let links = _.map(this.memory.cache.structures[STRUCTURE_LINK], (o) => { return Game.getObjectById(o)});
		let storageLinkId = this.memory.storageLinkId;
		let storageLink = Game.getObjectById(storageLinkId);
		if (!lib.isNull(storageLink))
		{
			links.forEach(function (link)
			{
				if (link.id != this.memory.storageLinkId && link.energy > 200)
				{
					link.transferEnergy(storageLink);
				}
			} , this);
		}
	}
};

/***********************************************************************************************************************
 * Resource related functions
 *
 */

Room.prototype.updateResources = function ()
{
	let debug = false;
	let roomName = this.name;
	// determine room resources ----------------------------------------------------------------------------
	// energy
	this.memory.resources = {};
	this.memory.resources.spawnEnergy = this.getSpawnEnergy();

	// get room collector status
	this.memory.resources.controllerStatus = this.updateControllerStatus();

	// output info
	lib.log("---- Room Resources: " + this.name, debug);
	lib.log('  Spawn Energy: ' + this.memory.resources.spawnEnergy.energy + '/'
		+ this.memory.resources.spawnEnergy.energyCapacity
		+ ' Controller Level: ' + this.memory.resources.controllerStatus.level + ' '
		+ this.memory.resources.controllerStatus.progress + '/' + this.memory.resources.controllerStatus.progressTotal
		+ ' Downgrade: ' + this.memory.resources.controllerStatus.ticksToDowngrade, debug);

	// get unit resources
	this.memory.resources.units = {};
	for (let unitName in units)
	{

		this.memory.resources.units[unitName] = {};
		this.memory.resources.units[unitName].total = _.has(global, "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName].length : 0;
		this.memory.resources.units[unitName].allocated = 0;
		this.memory.resources.units[unitName].unallocated = this.memory.resources.units[unitName].total;
		this.memory.resources.units[unitName].unassigned = creepManager.countRoomUnassignedUnits(this.name, unitName);
		this.memory.resources.units[unitName].assigned = creepManager.countRoomAssignedUnits(this.name, unitName);
		lib.log("  " + unitName + " total: " + this.memory.resources.units[unitName].total
			+ " Assigned/UnAssigned: " + this.memory.resources.units[unitName].assigned
			+ "/" + this.memory.resources.units[unitName].unassigned, debug);
	}

	return this.memory.resources;
};

Room.prototype.getSpawnEnergy = function ()
{
	let result = {};
	result.energy = 0;
	result.energyCapacity = 0;

	// Enumerate over spawns
	for (let spawnName in Game.spawns)
	{
		let spawn = Game.spawns[spawnName];
		if (spawn.room.name === this.name)
		{
			result.energy += spawn.energy;
			result.energyCapacity += spawn.energyCapacity;
		}
	}

	let extenderEnergy = this.getExtenderEnergy();
	result.energy += extenderEnergy.energy;
	result.energyCapacity += extenderEnergy.energyCapacity;

	return result;
};

Room.prototype.getExtenderEnergy = function ()
{
	let result = {};
	result.energy = 0;
	result.energyCapacity = 0;

	let extenders = this.find(FIND_MY_STRUCTURES , {filter: {structureType: STRUCTURE_EXTENSION}});
	extenders.forEach(function (ex)
	{
		result.energy += ex.energy;
		result.energyCapacity += ex.energyCapacity;
	} , this);

	return result;
};

Room.prototype.updateControllerStatus = function ()
{
	this.memory.controllerStatus = {};
	// Enumerate over spawns
	let controller = this.controller;

	if (this.getIsMine())
	{
		this.memory.controllerStatus.progress = controller.progress;
		this.memory.controllerStatus.progressTotal = controller.progressTotal;
		this.memory.controllerStatus.ticksToDowngrade = controller.ticksToDowngrade;
		this.memory.controllerStatus.level = controller.level;
	} else {
		this.memory.controllerStatus.progress = 0;
		this.memory.controllerStatus.progressTotal = 0;
		this.memory.controllerStatus.ticksToDowngrade = 0;
		this.memory.controllerStatus.level = 0;
	}

	return this.memory.controllerStatus;
};


/***********************************************************************************************************************
 * General info functions
 *
 */

Room.prototype.getControllerLevel = function ()
{
	let result = 0;
	if (!lib.isNull(this.controller))
	{
		result = this.controller.level;
	}
	return result;
};

Room.prototype.getIsMine = function ()
{
	let result = false;
	if (!lib.isNull(this.controller) && this.controller.my)
	{
		result = true;
	}
	return result;
};

/***********************************************************************************************************************
 * Creep finding functions
 *
 */

Room.prototype.getLostCreeps = function ()
{
	let roomName = this.name;

	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name === roomName
			&& creep.memory.motive.room != roomName;
	});

	return result;
};

Room.prototype.handleLostCreeps = function()
{
	let lostCreeps = this.getLostCreeps();
	lostCreeps.forEach(function (creep)
	{
		let room = Game.rooms[creep.memory.motive.room];

		if (!lib.isNull(room) && !lib.isNull(room.controller))
		{
			creep.moveTo(room.controller);
			creep.say("Exit!");
		} else {
			let exit = creep.room.findExitTo(creep.memory.motive.room);
			// and move to exit
			creep.moveTo(creep.pos.findClosestByPath(exit, { ignoreCreeps: true }));
			creep.say("Leave!");
		}
	}, this);
};

Room.prototype.getMaxHarvesters = function ()
{
	let sources = this.find(FIND_SOURCES);
	let result = 0;
	_.forEach(sources, function (s) {
		result += s.getMaxHarvesters();
	});

	//console.log("MAX: " + result);
	return result;
};


/***********************************************************************************************************************
 * Military functions
 *
 */

Room.prototype.safeModeFailsafe = function ()
{
	let debug = false;
	if (this.getIsMine())
	{
		let controller = this.controller;
		//safeMode	number	How many ticks of safe mode remaining, or undefined.
		let safeMode = lib.nullProtect(controller.safeMode , 0);
		//safeModeAvailable	number	Safe mode activations available to use.
		let safeModeAvailable = lib.nullProtect(controller.safeModeAvailable , 0);
		//safeModeCooldown	number	During this period in ticks new safe mode activations will be blocked, undefined if cooldown is inactive.
		let safeModeCooldown = lib.nullProtect(controller.safeModeCooldown , 0);
		let hostiles = lib.nullProtect(lib.nullProtect(this.threat, {}).threats, []).length;

		if (!safeMode && safeModeAvailable && !safeModeCooldown && (this.memory.threat.level === C.THREAT_PANIC))
		{
			lib.log("!!!!!!!!!!!!!!! ACTIVATING SAFE MODE !!!!!!!!!!!!!!!", debug);
			controller.activateSafeMode();
		}
		lib.log(">>>> Safe Mode Status: Hostiles: " + hostiles
			+ " SafeMode: " + safeMode
			+ " SafeModeAvailable: " + safeModeAvailable
			+ " SafeModeCooldown: " + safeModeCooldown, debug);
	}
};

Room.prototype.motivateTowers = function ()
{
	if (this.getIsMine())
	{
		// find all towers
		let towers = _.map(this.memory.cache.structures[STRUCTURE_TOWER], (o) => { return Game.getObjectById(o)});


		if (this.memory.threat.level >= C.THREAT_ALERT)
		{
			// for each tower
			towers.forEach(function (tower)
			{
				tower.autoAttack();
				tower.autoCreepHeal();
				tower.autoRepair();
			} , this);
		} else if (Game.time % 5 === 0) {
			// for each tower
			towers.forEach(function (tower)
			{
				tower.autoCreepHeal();
				tower.autoRepair();
			} , this);
		}
	}
};

Room.prototype.updateThreat = function ()
{
	let debug = false;
	let timeSinceSeen;
	let threatCounts;
	let filteredThreats;
	let threatsRaw;
	let threats;

	// init memory if need be
	if (lib.isNull(this.memory.threat))
	{
		this.memory.threat = {};
		this.memory.threat.lastSeen = 0;
		this.memory.threat.count = 0;
		this.memory.threat.threats = [];
		this.memory.threat.level = C.THREAT_STANDBY;
		this.memory.threat.breach = false;
	}

	timeSinceSeen = Game.time - this.memory.threat.lastSeen;

	// update aggressives based on our current status
	if (this.memory.threat.level >= C.THREAT_ALERT)
	{
		this.memory.threat.threats = this.getThreats();
		if (Game.time % 5 === 0)	{
			this.memory.threat.breach = this.getBreach();
		}
	} else if (this.memory.threat.level >= C.THREAT_PLAYER)
	{
		this.memory.threat.threats = this.getThreats();
		this.memory.threat.breach = this.getBreach();
	} else if (Game.time % 5 === 0)
	{
		this.memory.threat.threats = this.getThreats();
		this.memory.threat.breach = this.getBreach();
	}

	threatCounts = _.countBy(this.memory.threat.threats, (o) => { return o.status});

	if (lib.isNull(threatCounts[C.RELATION_HOSTILE]))
		threatCounts[C.RELATION_HOSTILE] = 0;

	lib.log(`ThreatCounts: ${JSON.stringify(threatCounts)}`, debug);
	lib.log("ALERT: " + (timeSinceSeen < config.alertTime), debug);

	// based on threats, update our status
	if (timeSinceSeen > config.alertTime && threatCounts[C.RELATION_HOSTILE] === 0)
	{
		//console.log("Standby");
		this.memory.threat.level = C.THREAT_STANDBY;
		this.memory.threat.count = lib.nullProtect(this.memory.threat.threats, []).length;
	} else if (timeSinceSeen < config.alertTime && threatCounts[C.RELATION_HOSTILE] === 0)
	{
		//console.log("Alert");
		this.memory.threat.level = C.THREAT_ALERT;
		this.memory.threat.count = threatCounts[C.RELATION_HOSTILE].length;
	}
	else if (threatCounts[C.RELATION_HOSTILE] > 0)
	{
		//console.log("Some threat!");
		filteredThreats = _.filter(this.memory.threat.threats, (o) => { return o.status === C.RELATION_HOSTILE});
		threatsRaw = _.map(filteredThreats, (o) => { return Game.getObjectById(o.id) } );

		//console.log(JSON.stringify(threatsRaw));
		let isPlayer = _.some(threatsRaw, (o) => o.owner.username != "Invader");
		let link = roomLink(this.name);

		if (isPlayer)
		{
			this.memory.threat.level = C.THREAT_PLAYER;
			console.log("!!!> PLAYER THREAT: " + link);
		} else {
			this.memory.threat.level = C.THREAT_NPC;
			console.log("!!!> NPC THREAT! " + link);
		}

		if (this.memory.threats >= C.THREAT_NPC && this.memory.threat.breach)
		{
			this.memory.threat.level = C.THREAT_PANIC;
			console.log("!!!> WALL BREACH! " + link);
		}

		this.memory.threat.lastSeen = Game.time;
		this.memory.threat.count = threatCounts[C.RELATION_HOSTILE];
	}
};

Room.prototype.getThreats = function ()
{
	let hostiles = this.find(FIND_HOSTILE_CREEPS);
	let result = _.map(hostiles, (c) => {
		let r = {};
		r.id = c.id;
		r.status = diplomacyManager.status(c.owner.username);
		//console.log("getThreats: " + c.owner.username);
		return r;
	});
	return result;
};

Room.prototype.getBreach = function ()
{
	let result = false;
	let spawn, spawnId;

	// if not my room, always return false
	if (!this.getIsMine())
		return result;

	spawnId = this.memory.cache.structures[STRUCTURE_SPAWN][0];
	spawn = Game.getObjectById(spawnId);
	if (!lib.isNull(spawn))
	{
		result = !spawn.pos.isEnclosed();
	}

	return result;
};

/*
 * NOTES: sentences are broken down using | to separate pieces
 *        public will default to true
 * Room.prototype.sing(sentence, public)
 *   all creeps in the room will sing parts of the sentence
 *     from top left to bottom right. the sentence will repeat
 *     if there are more creeps than parts in the sentence
 */
Room.prototype.sing = function(sentence, public){
	if(public === undefined)public = true;
	let words = sentence.split(" ");
	let creeps = _.filter(Game.creeps, (c) => c.room.name === this.name);
	creeps = _.sortBy(creeps, function(c){return (c.pos.x + (c.pos.y*50))});

	for(let i in creeps){
		creeps[i].say(words[i % words.length], public);
	}
};

module.exports = function() {};