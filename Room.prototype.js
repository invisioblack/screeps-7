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
	cpuManager.timerStart(`\t  Room Init ${this.name}` , `motivate.r1.ri.${roomName}`);

	let reservation = {};
	reservation.time = Game.time;

	this.initMemCache();
	this.updateEnergyPickupMode();
	this.updateUnitDemands();

	// update defenses -----------------------------------------------------------------------------------------
	this.updateThreat();
	this.updateMode();

	// init ldh targets mem
	if (lib.isNull(this.memory.longDistanceHarvestTargets))
	{
		this.memory.longDistanceHarvestTargets = [];
	}

	// update ldh reservations
	if (!lib.isNull(this.controller) && !lib.isNull(this.controller.reservation))
	{
		if (this.controller.reservation.username === C.ME)
		{
			reservation.tickToEnd = this.controller.reservation.ticksToEnd;
		}
		else
		{
			reservation.tickToEnd = 0;
		}
	}
	else
	{
		reservation.tickToEnd = 0;
	}

	this.memory.reservation = reservation;

	// init RSL
	if (this.isMine && !lib.isNull(this.memory.cache))
	{
		let numExtensions = lib.nullProtect(this.memory.cache.structures[STRUCTURE_EXTENSION] , []).length;
		if (numExtensions < 5)
		{
			this.memory.rsl = 1;
			this.memory.spawnEnergy = 300;
		}
		else if (numExtensions < 10)
		{
			this.memory.rsl = 2;
			this.memory.spawnEnergy = 550;
		}
		else if (numExtensions < 20)
		{
			this.memory.rsl = 3;
			this.memory.spawnEnergy = 800;
		}
		else if (numExtensions < 30)
		{
			this.memory.rsl = 4;
			this.memory.spawnEnergy = 1300;
		}
		else if (numExtensions < 40)
		{
			this.memory.rsl = 5;
			this.memory.spawnEnergy = 1800;
		}
		else if (numExtensions < 50)
		{
			this.memory.rsl = 6;
			this.memory.spawnEnergy = 2300;
		}
		else if (numExtensions < 60)
		{
			this.memory.rsl = 7;
			this.memory.spawnEnergy = 5300;
		}
		else
		{
			this.memory.rsl = 8;
			this.memory.spawnEnergy = 12300;
		}

		this.memory.lastSeen = Game.time;
	}
	cpuManager.timerStop(`motivate.r1.ri.${this.name}` , config.cpuInitDetailDebug);
};

/**
 * Rebuild room cache.
 * @param forceRefresh
 */
Room.prototype.initMemCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache) || forceRefresh)
	{
		this.memory.cache = {};
		forceRefresh = true;
	}

	this.updateStructureCache(forceRefresh);
	this.updateConstructionCache(forceRefresh);
	this.updateSourceCache(forceRefresh);
	this.updateSpawnCache(forceRefresh);
	this.updateDroppedCache(forceRefresh);
	this.updateFlagCache(forceRefresh);
	Room.updateUnitCache(this.name);
	Room.updateUnitMotiveCache(this.name);
};

/**
 * Updates the memory structure cache to reduce the number of Room.find() calls for structures
 * @param forceRefresh
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
	{
		forceRefresh = true;
	}

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
				let foundStructures = room.find(FIND_STRUCTURES , {filter: st => st.structureType === s});
				//console.log(`Found ${foundStructures}...`);

				// map structure ids to the memory object
				structures[s] = _.map(foundStructures , 'id');
			}
		});

		structures[STRUCTURE_ALL_NOWALL] = _.map(room.find(FIND_STRUCTURES , {filter: s => s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART}) , 'id');
		structures[STRUCTURE_ALL_WALL] = _.map(room.find(FIND_STRUCTURES , {filter: (s) => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART}) , 'id');
	}
};

/**
 * updateSourceCache
 * @param forceRefresh
 */
Room.prototype.updateSourceCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.sources))
	{
		this.memory.cache.sources = {};
		forceRefresh = true;
	}

	if (Game.time % 100 === 0)
	{
		forceRefresh = true;
	}

	if (forceRefresh)
	{
		let foundSources = this.find(FIND_SOURCES);
		//console.log(`Found: ${foundSources}`);

		// map structure ids to the memory object
		this.memory.cache.sources = _.map(foundSources , 'id');
		//console.log(`Result ${this.memory.cache.sources}`);
	}
};

/**
 * updateSpawnCache
 * @param forceRefresh
 */
Room.prototype.updateSpawnCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.sources))
	{
		this.memory.cache.spawns = {};
		forceRefresh = true;
	}

	if (Game.time % 100 === 0)
	{
		forceRefresh = true;
	}

	if (forceRefresh)
	{
		let foundSpawns;
		if (this.isMine)
			foundSpawns = this.find(FIND_MY_SPAWNS);
		else
			foundSpawns = this.find(FIND_HOSTILE_SPAWNS);

		// map structure ids to the memory object
		this.memory.cache.spawns = _.map(foundSpawns , 'id');
	}
};

/**
 * updateConstructionCache
 * @param forceRefresh
 */
Room.prototype.updateConstructionCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.construction))
	{
		this.memory.cache.construction = {};
		forceRefresh = true;
	}

	if (Game.time % 5 === 0)
	{
		forceRefresh = true;
	}

	if (forceRefresh)
	{
		let foundConstruction = this.find(FIND_CONSTRUCTION_SITES);
		//console.log(`Found: ${foundSources}`);

		// map structure ids to the memory object
		this.memory.cache.construction = _.map(foundConstruction , 'id');
		//console.log(`Result ${this.memory.cache.sources}`);
	}
};

/**
 * updateDroppedCache
 * @param forceRefresh
 */
Room.prototype.updateDroppedCache = function (forceRefresh = false)
{
	// insure the memory object exists
	if (lib.isNull(this.memory.cache.dropped))
	{
		this.memory.cache.dropped = {};
		forceRefresh = true;
	}

	if (Game.time % 5 === 0)
	{
		forceRefresh = true;
	}

	if (forceRefresh)
	{
		let foundDropped = this.find(FIND_DROPPED_RESOURCES);
		//console.log(`Found: ${foundDropped}`);

		// map structure ids to the memory object
		this.memory.cache.dropped = _.map(foundDropped , 'id');
		//console.log(`Result ${this.memory.cache.sources}`);
	}
};

/**
 * updateFlagCache
 * @param forceRefresh
 */
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
	{
		forceRefresh = true;
	}

	if (forceRefresh)
	{
		let foundFlags = this.find(FIND_FLAGS , {
			filter: (f) =>
			{
				return f.room.name === roomName;
			}
		});
		let flagNames = _.map(foundFlags , 'name');
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
	if (Game.time % 10 !== 0)
	{
		return;
	}

	let result = C.ROOM_ENERGYPICKUPMODE_NOENERGY;

	if (this.memory.cache.sources.length > 0)
	{
		result = C.ROOM_ENERGYPICKUPMODE_HARVEST;

		let roomName = this.name;
		let numContainers = lib.nullProtect(this.memory.cache.structures[STRUCTURE_CONTAINER] , []).length;
		let numStorage = lib.nullProtect(this.memory.cache.structures[STRUCTURE_STORAGE] , []).length;
		let numLink = lib.nullProtect(this.memory.cache.structures[STRUCTURE_LINK] , []).length;
		let containers = _.map(this.memory.cache.structures[STRUCTURE_CONTAINER] , function (cid)
		{
			return Game.getObjectById(cid);
		});
		let containerEnergy;
		if (lib.isNull(containers) || containers.length === 0)
		{
			containerEnergy = 0;
		}
		else
		{
			containerEnergy = _.sum(containers , function (c)
			{
				if (lib.isNull(c))
				{
					return 0;
				}
				else
				{
					return c.store[RESOURCE_ENERGY];
				}
			});
		}

		let numHarvesters = Room.countUnits(roomName , "harvester");
		let numHaulers = Room.countUnits(roomName , "hauler");

		/** precontainer, or container setup mode, is when we have containers, but they are not properly manned, check
		 * for energy in containers in this mode, but don't rely on it
		 */

		if (numContainers > 0)
		{
			result = C.ROOM_ENERGYPICKUPMODE_PRECONTAINER;
		}

		if (numContainers >= this.memory.cache.sources.length && (containerEnergy > 0 || numHarvesters > 0))
		//if (numContainers > 0)
		{
			result = C.ROOM_ENERGYPICKUPMODE_CONTAINER;
		}

		if (numStorage > 0 && this.isMine && numHaulers > 0 && numHarvesters > 0)
		{
			result = C.ROOM_ENERGYPICKUPMODE_STORAGE;
		}

		if (numLink > 1 && numHaulers > 0 && numHarvesters > 0 && this.isMine)
		{
			result = C.ROOM_ENERGYPICKUPMODE_LINK;
		}
	}

	this.memory.energyPickupMode = result;
	return result;
};

/**
 *
 */
Room.prototype.updateMode = function ()
{
	let relation = this.getRelation();
	let result = C.ROOM_MODE_NEUTRAL;
	// my rooms
	if (this.isMine)
	{
		let numWorkers = Room.countUnits(this.name , "worker");

		if (this.memory.threat.level >= C.THREAT_NPC)
		{
			result = C.ROOM_MODE_SIEGE;
		}
		else if (numWorkers < config.unit.min.worker)
		{
			result = C.ROOM_MODE_WORKER_PANIC;
		}
		else if (this.memory.cache.structures[STRUCTURE_EXTENSION].length < 5)
		{
			result = C.ROOM_MODE_SETTLE;
		}
		else
		{
			result = C.ROOM_MODE_NORMAL;
		}
	}
	// my harvest rooms
	else if (Room.getIsLongDistanceHarvestTarget(this.name))
	{
		if (this.memory.threat.level >= C.THREAT_NPC)
		{
			result = C.ROOM_MODE_REMOTE_HARVEST_SIEGE;
		}
		else
		{
			result = C.ROOM_MODE_REMOTE_HARVEST;
		}
	}
	// my ally rooms
	else if (relation > C.RELATION_NEUTRAL)
	{
		result = C.ROOM_MODE_ALLY;
	}
	// enemy room
	else if (relation === C.RELATION_HOSTILE)
	{
		result = C.ROOM_MODE_ENEMY;
	}
	// neutral room
	else
	{
		result = C.ROOM_MODE_NEUTRAL;
	}

	this.memory.mode = result;
};

/**
 *
 */
Room.prototype.updateUnitDemands = function ()
{
	// init memory
	this.memory.demands = {};
	_.forEach(units , (unit , unitName) =>
	{
		this.memory.demands[unitName] = 0;
	});

	// add in demands
	_.forEach(this.memory.motivations , (motivation , motivationName) =>
	{
		if (!lib.isNull(motivation.demands) && motivation.active)
		{
			_.forEach(motivation.demands.units , (demand , unitName) =>
			{
				this.memory.demands[unitName] += demand;
			});
		}
	});

};

/**
 * Motivates link in a room, should only be called on my rooms.
 */
Room.prototype.motivateLinks = function ()
{
	// find all towers
	let links = Room.getStructuresType(this.name , STRUCTURE_LINK);
	let storageLink = Game.getObjectById(this.memory.storageLinkId);
	if (!lib.isNull(storageLink))
	{
		_.forEach(links , link =>
		{
			if (link.id != this.memory.storageLinkId && link.energy > 200 && storageLink.energy < (storageLink.energyCapacity - 50))
			{
				link.transferEnergy(storageLink);
			}
		});
	}
};

/***********************************************************************************************************************
 * Resource related functions
 *
 */

/**
 * getSpawnEnergy
 * @returns {{}}
 */
Room.prototype.getSpawnEnergy = function ()
{
	let result = {};
	let extenderEnergy = this.getExtenderEnergy();

	result.energy = 0;
	result.energyCapacity = 0;

	// Enumerate over spawns
	_.forEach(Room.getSpawns(this.name) , spawn =>
	{
		result.energy += spawn.energy;
		result.energyCapacity += spawn.energyCapacity;
	});

	result.energy += extenderEnergy.energy;
	result.energyCapacity += extenderEnergy.energyCapacity;

	return result;
};

/**
 * getExtenderEnergy
 * @returns {{}}
 */
Room.prototype.getExtenderEnergy = function ()
{
	let result = {};
	result.energy = 0;
	result.energyCapacity = 0;

	_.forEach(Room.getStructuresType(this.name, STRUCTURE_EXTENSION), ex =>
	{
		result.energy += ex.energy;
		result.energyCapacity += ex.energyCapacity;
	});

	return result;
};

/**
 * getContainerEnergy
 * @returns {{}}
 */
Room.prototype.getContainerEnergy = function ()
{
	let result = {};
	result.energy = 0;
	result.energyCapacity = 0;

	_.forEach(Room.getStructuresType(this.name , STRUCTURE_CONTAINER), ex =>
	{
		result.energy += ex.store[RESOURCE_ENERGY];
		result.energyCapacity += ex.storeCapacity;
	});

	return result;
};

/***********************************************************************************************************************
 * General info functions
 *
 */

/**
 * getControllerLevel
 * @returns {number}
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

Room.prototype.getRelation = function ()
{
	let result = false;

	if (!lib.isNull(this.controller))
	{
		let owner = this.controller.owner;
		let ownerRelation = diplomacyManager.status(owner);
		result = ownerRelation;
	}
	else
	{
		result = C.RELATION_NEUTRAL;
	}

	return result;
};

/***********************************************************************************************************************
 * Creep finding functions
 *
 */
Room.prototype.getMaxHarvesters = function ()
{
	let result = 0;
	_.forEach(Room.getSources(this.name) , function (s)
	{
		result += s.getMaxHarvesters();
	});

	return result;
};

/***********************************************************************************************************************
 * Military functions
 *
 */

/**
 * Activates safe mode if it needs too, should only be called on my rooms.
 */
Room.prototype.safeModeFailsafe = function ()
{
	let debug = false;
	let controller = this.controller;
	//safeMode	number	How many ticks of safe mode remaining, or undefined.
	let safeMode = lib.nullProtect(controller.safeMode , 0);
	//safeModeAvailable	number	Safe mode activations available to use.
	let safeModeAvailable = lib.nullProtect(controller.safeModeAvailable , 0);
	//safeModeCooldown	number	During this period in ticks new safe mode activations will be blocked, undefined if cooldown is inactive.
	let safeModeCooldown = lib.nullProtect(controller.safeModeCooldown , 0);
	let hostiles = lib.nullProtect(lib.nullProtect(this.threat , {}).threats , []).length;

	if (!safeMode && safeModeAvailable && !safeModeCooldown && (this.memory.threat.level === C.THREAT_PANIC))
	{
		lib.log("!!!!!!!!!!!!!!! ACTIVATING SAFE MODE !!!!!!!!!!!!!!!" , debug);
		controller.activateSafeMode();
	}
	lib.log(">>>> Safe Mode Status: Hostiles: " + hostiles
		+ " SafeMode: " + safeMode
		+ " SafeModeAvailable: " + safeModeAvailable
		+ " SafeModeCooldown: " + safeModeCooldown , debug);
};

/**
 * Motivates towers in a room. should only be called on one of my rooms.
 */
Room.prototype.motivateTowers = function ()
{
	// find all towers
	let towers = Room.getStructuresType(this.name , STRUCTURE_TOWER);

	if (this.memory.threat.level >= C.THREAT_ALERT)
	{
		// for each tower
		towers.forEach(function (tower)
		{
			//tower.autoRepair();
			tower.autoCreepHeal();
			tower.autoAttack();
		} , this);
	}
	else if (Game.time % 2 === 0)
	{
		// for each tower
		towers.forEach(function (tower)
		{
			if (!tower.autoRepair())
			{
				tower.autoCreepHeal();
			}
		} , this);
	}
};

/**
 *
 */
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
		if (Game.time % 5 === 0)
		{
			this.memory.threat.breach = this.getBreach();
		}
	}
	else if (this.memory.threat.level >= C.THREAT_PLAYER)
	{
		this.memory.threat.threats = this.getThreats();
		this.memory.threat.breach = this.getBreach();
	}
	else if (Game.time % 5 === 0)
	{
		this.memory.threat.threats = this.getThreats();
		this.memory.threat.breach = this.getBreach();
	}

	threatCounts = _.countBy(this.memory.threat.threats , (o) =>
	{
		return o.status
	});

	if (lib.isNull(threatCounts[C.RELATION_HOSTILE]))
	{
		threatCounts[C.RELATION_HOSTILE] = 0;
	}

	lib.log(`Room: ${roomLink(this.name)} ThreatCounts: ${JSON.stringify(threatCounts)}` , debug);
	lib.log("ALERT: " + (timeSinceSeen < config.alertTime) , debug);

	// based on threats, update our status
	if (timeSinceSeen > config.alertTime && threatCounts[C.RELATION_HOSTILE] === 0)
	{
		//console.log("Standby");
		this.memory.threat.level = C.THREAT_STANDBY;
		this.memory.threat.count = lib.nullProtect(this.memory.threat.threats , []).length;
	}
	else if (timeSinceSeen < config.alertTime && threatCounts[C.RELATION_HOSTILE] === 0)
	{
		//console.log("Alert");
		this.memory.threat.level = C.THREAT_ALERT;
		this.memory.threat.count = threatCounts[C.RELATION_HOSTILE].length;
	}
	else if (threatCounts[C.RELATION_HOSTILE] > 0)
	{
		//console.log("Some threat!");
		filteredThreats = _.filter(this.memory.threat.threats , (o) =>
		{
			return o.status === C.RELATION_HOSTILE
		});
		threatsRaw = _.map(filteredThreats , (o) =>
		{
			return Game.getObjectById(o.id)
		});

		//console.log(JSON.stringify(threatsRaw));
		let isPlayer = _.some(threatsRaw , (o) => o.owner.username !== "Invader" && o.owner.username !== "Source Keeper");
		let link = roomLink(this.name);

		if (isPlayer)
		{
			this.memory.threat.level = C.THREAT_PLAYER;
			console.log("!!!> PLAYER THREAT: " + link);
		}
		else
		{
			this.memory.threat.level = C.THREAT_NPC;
			console.log("!!!> NPC THREAT! " + link);
		}

		if (this.memory.threat.level >= C.THREAT_NPC && this.memory.threat.breach)
		{
			this.memory.threat.level = C.THREAT_PANIC;
			console.log("!!!> WALL BREACH! " + link);
		}

		this.memory.threat.lastSeen = Game.time;
		this.memory.threat.count = threatCounts[C.RELATION_HOSTILE];
	}
};

/**
 *
 * @returns {TResult[]|boolean[]}
 */
Room.prototype.getThreats = function ()
{
	let hostiles = this.find(FIND_HOSTILE_CREEPS);
	let result = _.map(hostiles , (c) =>
	{
		let r = {};
		r.id = c.id;
		r.status = diplomacyManager.status(c.owner.username);
		//console.log("getThreats: " + c.owner.username);
		return r;
	});
	return result;
};

/**
 *
 * @returns {boolean}
 */
Room.prototype.getBreach = function ()
{
	let result = false;
	let spawn;

	spawn = Room.getSpawns(this.name)[0];
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
Room.prototype.sing = function (sentence , public)
{
	if (public === undefined)
	{
		public = true;
	}
	let words = sentence.split(" ");
	let creeps = _.filter(Game.creeps , (c) => c.room.name === this.name);
	creeps = _.sortBy(creeps , function (c)
	{
		return (c.pos.x + (c.pos.y * 50))
	});

	for (let i in creeps)
	{
		creeps[i].say(words[i % words.length] , public);
	}
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 * Static functions
 */

/**
 *
 * @param roomName
 * @returns {boolean}
 */
Room.getIsMine = function (roomName)
{
	let result = false;
	let room = Game.rooms[roomName];
	if (!lib.isNull(room))
	{
		result = room.isMine;
	}
	return result;
};

/**
 *
 */
Room.updateRoomCache = function ()
{
	// build room assigned cache
	global.cache.unitsByRoomMotive = _.groupBy(Game.creeps , 'memory.motive.room');
	global.cache.unitsByHomeRoom = _.groupBy(Game.creeps , 'memory.homeRoom');
};

/**
 *
 * @param roomName
 */
Room.updateUnitCache = function (roomName)
{
	let roomCreeps = global.cache.unitsByRoomMotive[roomName];
	let homeRoomCreeps = global.cache.unitsByHomeRoom[roomName];

	// build room assigned cache
	global.cache.rooms[roomName] = {};
	global.cache.rooms[roomName].creeps = roomCreeps;
	global.cache.rooms[roomName].units = _.groupBy(roomCreeps , 'memory.unit');

	// make sure all unit types are filled
	_.forEach(units , (v , k) =>
	{
		if (lib.isNull(global.cache.rooms[roomName].units[k]))
		{
			global.cache.rooms[roomName].units[k] = [];
		}
	});

	// build home room cache
	if (lib.isNull(global.cache.homeRooms))
	{
		global.cache.homeRooms = {};
	}
	global.cache.homeRooms[roomName] = {};
	global.cache.homeRooms[roomName].creeps = homeRoomCreeps;
	global.cache.homeRooms[roomName].units = _.groupBy(homeRoomCreeps , 'memory.unit');

	// make sure cache is filled with empty unit records
	_.forEach(units , (v , k) =>
	{
		if (lib.isNull(global.cache.homeRooms[roomName].units[k]))
		{
			global.cache.homeRooms[roomName].units[k] = [];
		}
	});
};

/**
 * room.memory.cache.unitMotive
 *  motivations
 *      units - count
 *      needs
 *          units - count
 * @param roomName
 */
Room.updateUnitMotiveCache = function (roomName)
{
	// declare
	let debug = false;
	let roomMemory;
	let roomCreeps;

	// validate room memory
	roomMemory = Memory.rooms[roomName];
	if (lib.isNull(roomMemory) || lib.isNull(roomMemory.motivations))
	{
		lib.log(`Error: updateUnitMotiveCache(${roomName}): room memory or motivation memory not found.` , debug);
		return;
	}

	// validate cache
	if (lib.isNull(roomMemory.cache))
	{
		roomMemory.cache = {};
	}

	// init unitMotive cache
	roomMemory.cache.unitMotive = {};

	// init each motive memory
	_.forEach(roomMemory.motivations , (motivation , motivationName) =>
	{
		roomMemory.cache.unitMotive[motivationName] = {};
		roomMemory.cache.unitMotive[motivationName].units = {};
		_.forEach(units , (uv , uk) =>
		{
			roomMemory.cache.unitMotive[motivationName].units[uk] = 0;
		});

		// init needs
		roomMemory.cache.unitMotive[motivationName].needs = {};
		_.forEach(motivation.needs , (nv , nk) =>
		{
			roomMemory.cache.unitMotive[motivationName].needs[nk] = {};
			roomMemory.cache.unitMotive[motivationName].needs[nk].units = {};
			_.forEach(units , (uv , uk) =>
			{
				roomMemory.cache.unitMotive[motivationName].needs[nk].units[uk] = 0;
			});
		});
	});

	// update creeps into cache
	roomCreeps = global.cache.unitsByRoomMotive[roomName];

	_.forEach(roomCreeps , (c , k) =>
	{
		if (c.memory.motive.motivation !== "")
		{
			//console.log(`c: ${c.name} r: ${c.memory.motive.room} m: ${c.memory.motive.motivation}`);
			if (lib.isNull(roomMemory.cache.unitMotive[c.memory.motive.motivation]))
			{
				roomMemory.cache.unitMotive[c.memory.motive.motivation] = {};
				roomMemory.cache.unitMotive[c.memory.motive.motivation].units = {};
				roomMemory.cache.unitMotive[c.memory.motive.motivation].units[c.memory.unit] = 0;
				roomMemory.cache.unitMotive[c.memory.motive.motivation].needs = {};

			}
			roomMemory.cache.unitMotive[c.memory.motive.motivation].units[c.memory.unit]++;
			if (lib.isNull(roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need]))
			{
				roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need] = {};
				roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units = {};
				roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units[c.memory.unit] = 0;

			}
			roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units[c.memory.unit]++;
		}
	});

	lib.log(`updateUnitMotiveCache(${roomName}): ${JSON.stringify(roomMemory.cache.unitMotive)}` , debug);
};

/**
 *
 * @param roomName
 * @returns {boolean}
 */
Room.getIsLongDistanceHarvestTarget = function (roomName)
{
	return lib.nullProtect(Memory.rooms[roomName].longDistanceHarvestParents , []).length > 0;
};

/**
 *
 * @param roomName
 * @param structureType
 * @returns {Array}
 */
Room.getStructureIdsType = function (roomName , structureType)
{
	return _.has(Memory , "rooms[" + roomName + "].cache.structures[" + structureType + "]") ? Memory.rooms[roomName].cache.structures[structureType] : [];
};

/**
 *
 * @param roomName
 * @param structureType
 * @returns {T[]}
 */
Room.getStructuresType = function (roomName , structureType)
{
	let ids = this.getStructureIdsType(roomName , structureType);
	let af = id => Game.getObjectById( id );
	return _( ids ).map( af ).filter().value();
};

/**
 *
 * @param roomName
 * @returns {Array}
 */
Room.getConstructionIds = function (roomName)
{
	return _.has(Memory , "rooms[" + roomName + "].cache.construction") ? Memory.rooms[roomName].cache.construction : [];
};

/**
 *
 * @param roomName
 * @returns {T[]}
 */
Room.getConstruction = function (roomName)
{
	let ids = this.getConstructionIds(roomName);
	let af = id => Game.getObjectById( id );
	return _( ids ).map( af ).filter().value();
};

/**
 *
 * @param roomName
 * @returns {Array}
 */
Room.getSourceIds = function (roomName)
{
	return _.has(Memory , `rooms[${roomName}].cache.sources`) ? Memory.rooms[roomName].cache.sources : [];
};

/**
 *
 * @param roomName
 * @returns {T[]}
 */
Room.getSources = function (roomName)
{
	let ids = this.getSourceIds(roomName);
	let af = id => Game.getObjectById( id );
	return _( ids ).map( af ).filter().value();
};

/**
 *
 * @param roomName
 * @returns {Array}
 */
Room.getDroppedIds = function (roomName)
{
	return _.has(Memory , `rooms[${roomName}].cache.dropped`) ? Memory.rooms[roomName].cache.dropped : [];
};

/**
 *
 * @param roomName
 * @returns {T[]}
 */
Room.getDropped = function (roomName)
{
	let ids = this.getDroppedIds(roomName);
	let af = id => Game.getObjectById( id );
	return _( ids ).map( af ).filter().value();
};

/**
 *
 * @param roomName
 * @returns {Array}
 */
Room.getFlagNames = function (roomName)
{
	return _.has(Memory , `rooms[${roomName}].cache.flags`) ? Memory.rooms[roomName].cache.flags : [];
};

/**
 *
 * @param roomName
 * @returns {T[]}
 */
Room.getFlags = function (roomName)
{
	let ids = this.getFlagNames(roomName);
	let af = id => Game.getObjectById( id );
	return _( ids ).map( af ).filter().value();
};

/**
 *
 * @param roomName
 * @returns {Array}
 */
Room.getSpawnIds = function (roomName)
{
	return _.has(Memory , `rooms[${roomName}].cache.spawns`) ? Memory.rooms[roomName].cache.spawns : [];
};

/**
 *
 * @param roomName
 * @returns {T[]}
 */
Room.getSpawns = function (roomName)
{
	let ids = this.getSpawnIds(roomName);
	let af = id => Game.getObjectById( id );
	return _( ids ).map( af ).filter().value();
};

/***********************************************************************************************************************
 * Creep finding functions
 */

/**
 *
 * @param roomName
 * @returns {*}
 */
Room.getCreeps = function (roomName)
{
	return _.has(global , "cache.rooms." + roomName + ".creeps") ? global.cache.rooms[roomName].creeps : [];
};

/**
 *
 * @param roomName
 * @param unitName
 * @returns {Number}
 */
Room.countUnits = function (roomName , unitName)
{
	let units = _.has(global , "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName] : [];
	return units.length;
};

/**
 *
 * @param roomName
 * @param unitName
 * @returns {Array}
 */
Room.getRoomUnits = function (roomName , unitName)
{
	return _.has(global , "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName] : [];
};

/**
 *
 * @param roomName
 * @param motivationName
 * @param unitName
 * @returns {number}
 */
Room.countMotivationUnits = function (roomName , motivationName , unitName)
{
	// new cache
	if (_.has(Memory , `rooms[${roomName}].cache.unitMotive[${motivationName}]`))
	{
		return Memory.rooms[roomName].cache.unitMotive[motivationName].units[unitName];
	}
	else
	{
		return 0;
	}
};

/**
 *
 * @param roomName
 * @param unitName
 * @returns {Number}
 */
Room.countHomeRoomUnits = function (roomName , unitName)
{
	let units = _.has(global , "cache.homeRooms." + roomName + ".units." + unitName) ? global.cache.homeRooms[roomName].units[unitName] : [];
	return units.length;
};

/**
 *
 * @param roomName
 * @param motivationName
 * @returns {string[]|T[]}
 */
Room.getRoomMotivationCreeps = function (roomName , motivationName)
{
	let result = _.filter(global.cache.rooms[roomName].creeps , function (creep)
	{
		return creep.memory.motive.motivation === motivationName;
	});
	return result;
};

/**
 *
 * @param roomName
 * @param motivationName
 * @param needName
 * @param unitName
 * @returns {number}
 */
Room.countMotivationNeedUnits = function (roomName , motivationName , needName , unitName)
{
	if (!lib.isNull(Memory.rooms[roomName].cache.unitMotive[motivationName].needs[needName]))
	{
		return Memory.rooms[roomName].cache.unitMotive[motivationName].needs[needName].units[unitName];
	}
	else
	{
		return 0;
	}
};

/**
 *
 * @param roomName
 * @returns {string[]|T[]}
 */
Room.getRoomUnassignedCreeps = function (roomName)
{
	return _.filter(global.cache.rooms[roomName].creeps , creep => creep.memory.motive.motivation === "");
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 * properties
 */
if (Room.prototype.hasOwnProperty('isMine') === false)
{
	Object.defineProperty(Room.prototype , "isMine" , {
		get: function ()
		{
			let result = false;
			if (!lib.isNull(this.controller) && this.controller.my && this.controller.level > 0)
			{
				result = true;
			}
			return result;
		}
	});
}

if (Room.prototype.hasOwnProperty('isMine') === false)
{
	Object.defineProperty(Room.prototype , "isLongDistanceHarvestTarget" , {
		get: function ()
		{
			return Room.getIsLongDistanceHarvestTarget(this.name);
		}
	});
}

module.exports = function ()
{
};