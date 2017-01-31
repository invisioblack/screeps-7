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

	if (this.getIsMine() && !lib.isNull(this.memory.cache))
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
	this.updateFlagCache(forceRefresh);
	Room.updateUnitCache(this.name);
	Room.updateUnitMotiveCache(this.name);
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
				let foundStructures = room.find(FIND_STRUCTURES , {
					filter: function (st)
					{
						return st.structureType === s;
					}
				});
				//console.log(`Found ${foundStructures}...`);

				// map structure ids to the memory object
				structures[s] = _.map(foundStructures , function (st)
				{
					return st.id;
				});
			}
		});

		structures[STRUCTURE_ALL_NOWALL] = _.map(
			room.find(FIND_STRUCTURES , {
				filter: (s) =>
				{
					return s.structureType != STRUCTURE_WALL
						&& s.structureType != STRUCTURE_RAMPART
				}
			}) , (o) =>
			{
				return o.id
			});
		structures[STRUCTURE_ALL_WALL] = _.map(room.find(FIND_STRUCTURES , {filter: (s) => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART}) , (o) =>	o.id);
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
	{
		forceRefresh = true;
	}

	if (forceRefresh)
	{
		let foundSources = this.find(FIND_SOURCES);
		//console.log(`Found: ${foundSources}`);

		// map structure ids to the memory object
		this.memory.cache.sources = _.map(foundSources , function (s)
		{
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

	if (Game.time % 5 === 0)
	{
		forceRefresh = true;
	}

	if (forceRefresh)
	{
		let foundDropped = this.find(FIND_DROPPED_RESOURCES);
		//console.log(`Found: ${foundDropped}`);

		// map structure ids to the memory object
		this.memory.cache.dropped = _.map(foundDropped , function (s)
		{
			return s.id;
		});
		//console.log(`Result ${this.memory.cache.sources}`);
	}
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
		let flagNames = _.map(foundFlags , (f) =>
		{
			return f.name
		});
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

	result = C.ROOM_ENERGYPICKUPMODE_NOENERGY;
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

		if (numStorage > 0 && this.getIsMine() && numHaulers > 0 && numHarvesters > 0)
		{
			result = C.ROOM_ENERGYPICKUPMODE_STORAGE;
		}

		if (numLink > 1 && numHaulers > 0 && numHarvesters > 0 && this.getIsMine())
		{
			result = C.ROOM_ENERGYPICKUPMODE_LINK;
		}
	}

	this.memory.energyPickupMode = result;
	return result;
};

Room.prototype.updateMode = function ()
{
	let relation = this.getRelation();
	let result = C.ROOM_MODE_NEUTRAL;
	// my rooms
	if (this.getIsMine())
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

Room.prototype.motivateLinks = function ()
{
	if (this.getIsMine())
	{
		// find all towers
		let links = _.map(this.memory.cache.structures[STRUCTURE_LINK] , (o) =>
		{
			return Game.getObjectById(o)
		});
		let storageLinkId = this.memory.storageLinkId;
		let storageLink = Game.getObjectById(storageLinkId);
		if (!lib.isNull(storageLink))
		{
			links.forEach(function (link)
			{
				if (link.id != this.memory.storageLinkId && link.energy > 200 && storageLink.energy < (storageLink.energyCapacity - 50))
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

Room.prototype.getContainerEnergy = function ()
{
	let result = {};
	result.energy = 0;
	result.energyCapacity = 0;

	let containers = Room.getStructuresType(this.name , STRUCTURE_CONTAINER);
	containers.forEach(function (ex)
	{
		result.energy += ex.store[RESOURCE_ENERGY];
		result.energyCapacity += ex.storeCapacity;
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
	}
	else
	{
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
	if (!lib.isNull(this.controller) && this.controller.my && this.controller.level > 0)
	{
		result = true;
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
	let sources = this.find(FIND_SOURCES);
	let result = 0;
	_.forEach(sources , function (s)
	{
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
	}
};

Room.prototype.motivateTowers = function ()
{
	if (this.getIsMine())
	{
		// find all towers
		let towers = _.map(this.memory.cache.structures[STRUCTURE_TOWER] , (o) =>
		{
			return Game.getObjectById(o)
		});

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

Room.prototype.getBreach = function ()
{
	let result = false;
	let spawn , spawnId;

	// if not my room, always return false
	if (!this.getIsMine())
	{
		return result;
	}

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
 * Static functions
 */

Room.getIsMine = function (roomName)
{
	let result = false;
	let room = Game.rooms[roomName];
	if (!lib.isNull(room))
	{
		result = room.getIsMine();
	}
	return result;
};

Room.updateRoomCache = function ()
{
	// build room assigned cache
	global.cache.unitsByRoomMotive = _.groupBy(Game.creeps, 'memory.motive.room');
	global.cache.unitsByHomeRoom = _.groupBy(Game.creeps, 'memory.homeRoom');
};

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
}

Room.getIsLongDistanceHarvestTarget = function (roomName)
{
	return lib.nullProtect(Memory.rooms[roomName].longDistanceHarvestParents , []).length > 0;
};

Room.getStructureIdType = function (roomName , structureType)
{
	let result = _.has(Memory , "rooms[" + roomName + "].cache.structures[" + structureType + "]") ? Memory.rooms[roomName].cache.structures[structureType] : [];
	return result;
};

Room.getStructuresType = function (roomName , structureType)
{
	let ids = this.getStructureIdType(roomName , structureType);
	let sites = _(ids).map(id => Game.getObjectById(id)).filter().value();
	return sites;
};

/***********************************************************************************************************************
 * Creep finding functions
 */

Room.getCreeps = function (roomName)
{
	return _.has(global , "cache.rooms." + roomName + ".creeps") ? global.cache.rooms[roomName].creeps : [];
};

Room.countUnits = function (roomName , unitName)
{
	let units = _.has(global , "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName] : [];
	return units.length;
};

Room.getRoomUnits = function (roomName , unitName)
{
	return _.has(global , "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName] : [];
};

Room.countMotivationUnits = function (roomName , motivationName , unitName)
{
	// new cache
	if (_.has(Memory, `rooms[${roomName}].cache.unitMotive[${motivationName}]`))
		return Memory.rooms[roomName].cache.unitMotive[motivationName].units[unitName];
	else return 0;
};

Room.countHomeRoomUnits = function (roomName , unitName)
{
	let units = _.has(global , "cache.homeRooms." + roomName + ".units." + unitName) ? global.cache.homeRooms[roomName].units[unitName] : [];
	return units.length;
};

Room.getRoomMotivationCreeps = function (roomName , motivationName)
{
	let result = _.filter(global.cache.rooms[roomName].creeps , function (creep)
	{
		return creep.memory.motive.motivation === motivationName;
	});
	return result;
};

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

Room.getRoomUnassignedCreeps = function (roomName)
{
	return _.filter(global.cache.rooms[roomName].creeps , creep => creep.memory.motive.motivation === "");
} ;

module.exports = function ()
{
};