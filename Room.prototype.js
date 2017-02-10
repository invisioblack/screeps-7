"use strict";

/***********************************************************************************************************************
 * management functions
 */

/**
 * Insure all memory is setup for a room
 */
Room.prototype.init = function ()
{
	cpuManager.timerStart(`\t  Room Init ${this.name}` , `motivate.r1.ri.${this.name}`);

	let reservation = {};
	reservation.time = Game.time;
	this.memory.lastSeen = Game.time;

	this.initMemCache();

	// init ldh targets mem
	if (lib.isNull(this.memory.rHarvestTargets))
	{
		this.memory.rHarvestTargets = [];
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
		let roomLevel = this.controllerLevel;
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

/***********************************************************************************************************************
 * Motivate functions
 */


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

	if (this.threat.level >= C.THREAT_ALERT)
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

/***********************************************************************************************************************
 * Misc
 */

/*
 * NOTES: sentences are broken down using | to separate pieces
 *        public will default to true
 * Room.prototype.sing(sentence, public)
 *   all creeps in the room will sing parts of the sentence
 *     from top left to bottom right. the sentence will repeat
 *     if there are more creeps than parts in the sentence
 */
Room.prototype.sing = function (sentence , isPublic)
{
	if (isPublic === undefined)
	{
		isPublic = true;
	}
	let words = sentence.split(" ");
	let creeps = _.filter(Game.creeps , (c) => c.room.name === this.name);
	creeps = _.sortBy(creeps , function (c)
	{
		return (c.pos.x + (c.pos.y * 50))
	});

	for (let i in creeps)
	{
		creeps[i].say(words[i % words.length] , isPublic);
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
 *
 * @param roomName
 */
Room.updateUnitMotiveCache = function (roomName)
{
	// declare
	let debug = false;
	let roomMemory = Memory.rooms[roomName];

	// validate room memory
	if (lib.isNull(roomMemory) || lib.isNull(roomMemory.motivations))
	{
		lib.log(`Error: updateUnitMotiveCache(${roomName}): room memory or motivation memory not found.` , debug);
		return;
	}

	// validate cache
	if (lib.isNull(global.cache.rooms))
	{
		global.cache.rooms = {};
	}

	// init unitMotive cache
	if (lib.isNull(global.cache.rooms[roomName]))
	{
		global.cache.rooms[roomName] = {};
	}
	global.cache.rooms[roomName].unitMotive = {};

	// init each motive memory
	_.forEach(roomMemory.motivations , (motivation , motivationName) =>
	{
		global.cache.rooms[roomName].unitMotive[motivationName] = {};
		global.cache.rooms[roomName].unitMotive[motivationName].units = {};
		_.forEach(units , (uv , uk) =>
		{
			global.cache.rooms[roomName].unitMotive[motivationName].units[uk] = 0;
		});

		// init needs
		global.cache.rooms[roomName].unitMotive[motivationName].needs = {};
		_.forEach(motivation.needs , (nv , nk) =>
		{
			global.cache.rooms[roomName].unitMotive[motivationName].needs[nk] = {};
			global.cache.rooms[roomName].unitMotive[motivationName].needs[nk].units = {};
			_.forEach(units , (uv , uk) =>
			{
				global.cache.rooms[roomName].unitMotive[motivationName].needs[nk].units[uk] = 0;
			});
		});
	});

	// update creeps into cache
	_.forEach(global.cache.unitsByRoomMotive[roomName] , (c , k) =>
	{
		if (c.memory.motive.motivation !== "")
		{
			//console.log(`c: ${c.name} r: ${c.memory.motive.room} m: ${c.memory.motive.motivation}`);
			if (lib.isNull(global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation]))
			{
				global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation] = {};
				global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].units = {};
				global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].units[c.memory.unit] = 0;
				global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].needs = {};

			}
			global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].units[c.memory.unit]++;
			if (lib.isNull(global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need]))
			{
				global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need] = {};
				global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units = {};
				global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units[c.memory.unit] = 0;

			}
			global.cache.rooms[roomName].unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units[c.memory.unit]++;
		}
	});

	//lib.log(`updateUnitMotiveCache(${roomName}): ${JSON.stringify(roomMemory.cache.unitMotive)}` , debug);
};

/**
 *
 * @param roomName
 * @returns {boolean}
 */
Room.getIsRHarvestTarget = function (roomName)
{
	return lib.nullProtect(Memory.rooms[roomName].rHarvestParents , []).length > 0;
};

/**
 * Returns "claim", "reserve",
 * @param roomName
 * @returns {*}
 */
Room.getClaim = function (roomName)
{

	let claim = _.find(Memory.claims, 'room', roomName);
	//console.log(`getClaim(${roomName}) claim: ${JSON.stringify(claim)}`);

	if (!lib.isNull(claim))
	{
		return claim.type;
	}
	else
	{
		return C.CLAIM_NONE;
	}
};

Room.getControllerLevel = function (roomName)
{
	if (!lib.isNull(Game.rooms[roomName]))
	{
		let room = Game.rooms[roomName];
		if (lib.isNull(room.memory.controllerLevel) || Game.time !== room.memory.controllerLevel.lastUpdated)
		{
			room.memory.controllerLevel = {
				level: 0 ,
				lastUpdated: Game.time
			};

			if (!lib.isNull(room.controller))
			{
				room.memory.controllerLevel.level = room.controller.level;
			}
		}

		return room.memory.controllerLevel.level;
	}
	else
	{
		if (_.has(Memory, `rooms[${roomName}].controllerLevel.level`))
		{
			return Memory.rooms[roomName].controllerLevel.level;
		}
		else
		{
			return 0;
		}
	}
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
	return _( ids ).map( af.goid ).filter().value();
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
	return _( ids ).map( af.goid ).filter().value();
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
	return _( ids ).map( af.goid ).filter().value();
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
	return _( ids ).map( af.goid ).filter().value();
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
	return _( ids ).map( af.goid ).filter().value();
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
	return _( ids ).map( af.goid ).filter().value();
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
	return _.has(global , `cache.rooms.${roomName}.creeps`) ? global.cache.rooms[roomName].creeps : [];
};

/**
 *
 * @param roomName
 */
Room.countCreeps = function (roomName)
{
	return Room.getCreeps(roomName).length;
};

/**
 *
 * @param roomName
 * @param unitName
 * @returns {Array}
 */
Room.getUnits = function (roomName, unitName)
{
	return _.has(global , `cache.rooms.${roomName}.units[${unitName}]`) ? global.cache.rooms[roomName].units[unitName] : [];
};

/**
 *
 * @param roomName
 * @param unitName
 * @returns {Number}
 */
Room.countUnits = function (roomName , unitName)
{
	return Room.getUnits(roomName, unitName).length;
};


Room.getHomeRoomUnits = function (roomName, unitName)
{
	return _.has(global , `cache.homeRooms.${roomName}.units.${unitName}`) ? global.cache.homeRooms[roomName].units[unitName] : [];
};

/**
 *
 * @param roomName
 * @param unitName
 * @returns {Number}
 */
Room.countHomeRoomUnits = function (roomName , unitName)
{
	return Room.getHomeRoomUnits(roomName, unitName).length;
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
	return _.has(global , `cache.rooms[${roomName}].unitMotive[${motivationName}].units[${unitName}]`) ? global.cache.rooms[roomName].unitMotive[motivationName].units[unitName] : 0;
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
	return _.has(global, `cache.rooms["${roomName}"].unitMotive["${motivationName}"].needs["${needName}"].units["${unitName}"]`) ? global.cache.rooms[roomName].unitMotive[motivationName].needs[needName].units[unitName] : 0;
};

/**
 *
 * @param roomName
 * @param motivationName
 * @returns {T[]|string[]}
 */
Room.getMotivationCreeps = function (roomName , motivationName)
{
	if (_.has(global, `cache.rooms[${roomName}].creeps`))
		return _.filter(global.cache.rooms[roomName].creeps , creep => creep.memory.motive.motivation === motivationName);
	else
		return [];
};

/**
 *
 * @param roomName
 * @returns {string[]|T[]}
 */
Room.getUnassignedCreeps = function (roomName)
{
	return _.has(global, `cache.rooms[${roomName}].creeps`) ? _.filter(global.cache.rooms[roomName].creeps , creep => creep.memory.motive.motivation === "") : [];
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

if (Room.prototype.hasOwnProperty('isRHarvestTarget') === false)
{
	Object.defineProperty(Room.prototype , "isRHarvestTarget" , {
		get: function ()
		{
			return Room.getIsRHarvestTarget(this.name);
		}
	});
}

if (Room.prototype.hasOwnProperty('threats') === false)
{
	Object.defineProperty(Room.prototype , "threats" , {
		get: function ()
		{
			let hostiles = this.find(FIND_HOSTILE_CREEPS);
			let result = _.map(hostiles , (c) =>
			{
				let r = {
					id: c.id,
					status: diplomacyManager.status(c.owner.username)
				};

				return r;
			});

			return result;
		}
	});
}

if (Room.prototype.hasOwnProperty('breach') === false)
{
	Object.defineProperty(Room.prototype , "breach" , {
		get: function ()
		{
			let result = false;
			let spawn;

			spawn = Room.getSpawns(this.name)[0];
			if (!lib.isNull(spawn))
			{
				result = !spawn.pos.isEnclosed();
			}

			return result;
		}
	});
}

/***********************************************************************************************************************
 * Lazy loading properties
 */

if (Room.prototype.hasOwnProperty('threat') === false)
{
	Object.defineProperty(Room.prototype , "threat" , {
		get: function ()
		{
			let debug = false;
			let updateCondition;


			if (lib.isNull(this.memory.threat) || this.memory.threat.level >= C.THREAT_ALERT)
			{
				updateCondition = true;
			}
			else
			{
				updateCondition =  Game.time > this.memory.threat.lastUpdated + 5;
			}

			if (lib.isNull(this.memory.threat) || updateCondition)
			{
				let timeSinceSeen;
				let threatCounts;
				let filteredThreats;
				let threatsRaw;

				// init memory if need be
				this.memory.threat = {
					lastSeen: 0 ,
					count: 0 ,
					threats: [] ,
					level: C.THREAT_STANDBY ,
					breach: false ,
					lastUpdated: Game.time
				};

				timeSinceSeen = Game.time - this.memory.threat.lastSeen;

				// update aggressives based on our current status
				this.memory.threat.threats = this.threats;
				this.memory.threat.breach = this.breach;


				//console.log(`this.threats: ${JSON.stringify(this.threats)}`);
				//console.log(`mem threats: ${JSON.stringify(this.memory.threat.threats)}`);

				threatCounts = _.countBy(this.memory.threat.threats , 'status');

				if (lib.isNull(threatCounts[C.RELATION_HOSTILE]))
				{
					threatCounts[C.RELATION_HOSTILE] = 0;
				}

				//lib.log(`Room: ${roomLink(this.name)} ThreatCounts: ${JSON.stringify(threatCounts)}` , debug);
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
					filteredThreats = _.filter(this.memory.threat.threats , o => o.status === C.RELATION_HOSTILE);
					threatsRaw = _(filteredThreats).map(af.ogoid).filter().value();

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
			}

			return this.memory.threat;
		}
	});
}

if (Room.prototype.hasOwnProperty('energyPickupMode') === false)
{
	Object.defineProperty(Room.prototype , "energyPickupMode" , {
		get: function ()
		{
			if (lib.isNull(this.memory.energyPickupMode) || Game.time > this.memory.energyPickupMode.lastUpdated + 10)
			{
				this.memory.energyPickupMode = {
					mode: C.ROOM_ENERGYPICKUPMODE_NOENERGY ,
					lastUpdated: Game.time
				};

				if (Room.getSourceIds(this.name).length > 0)
				{
					this.memory.energyPickupMode.mode = C.ROOM_ENERGYPICKUPMODE_HARVEST;

					let roomName = this.name;
					let containers = Room.getStructuresType(roomName , STRUCTURE_CONTAINER);
					let numStorage = Room.getStructureIdsType(roomName , STRUCTURE_STORAGE).length;
					let numLink = Room.getStructureIdsType(roomName , STRUCTURE_LINK).length;
					let numHarvesters = Room.countUnits(roomName , "harvester");
					let numHaulers = Room.countUnits(roomName , "hauler");
					let numSources = Room.getSourceIds(this.name).length;

					let containerEnergy;
					if (containers.length === 0)
					{
						containerEnergy = 0;
					}
					else
					{
						containerEnergy = _.sum(containers , `store[${RESOURCE_ENERGY}]`);
					}

					/** precontainer, or container setup mode, is when we have containers, but they are not properly manned, check
					 * for energy in containers in this mode, but don't rely on it
					 */

					if (containers.length > 0)
					{
						this.memory.energyPickupMode.mode = C.ROOM_ENERGYPICKUPMODE_PRECONTAINER;
					}

					if (containers.length >= numSources && (containerEnergy > 0 || numHarvesters > 0))
					{
						this.memory.energyPickupMode.mode = C.ROOM_ENERGYPICKUPMODE_CONTAINER;
					}

					if (numStorage > 0 && this.isMine && numHaulers > 0 && numHarvesters > 0)
					{
						this.memory.energyPickupMode.mode = C.ROOM_ENERGYPICKUPMODE_STORAGE;
					}

					if (numLink > 1 && numHaulers > 0 && numHarvesters > 0 && this.isMine)
					{
						this.memory.energyPickupMode.mode = C.ROOM_ENERGYPICKUPMODE_LINK;
					}
				}
			}

			return this.memory.energyPickupMode.mode;
		}
	});
}

if (Room.prototype.hasOwnProperty('roomMode') === false)
{
	Object.defineProperty(Room.prototype , "roomMode" , {
		get: function ()
		{
			if (lib.isNull(this.memory.mode) || Game.time !== this.memory.mode.lastUpdated)
			{
				let relation = this.relation;
				let result = C.ROOM_MODE_NEUTRAL;

				this.memory.mode = {
					mode: result,
					lastUpdated: Game.time
				};

				// my rooms
				if (this.isMine)
				{
					let numWorkers = Room.countUnits(this.name , "worker");

					if (this.threat.level >= C.THREAT_NPC)
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
				else if (this.isRHarvestTarget)
				{
					if (this.threat.level >= C.THREAT_NPC)
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

				this.memory.mode.mode = result;
			}

			return this.memory.mode.mode;
		}
	});
}

if (Room.prototype.hasOwnProperty('demands') === false)
{
	Object.defineProperty(Room.prototype , "demands" , {
		get: function ()
		{
			if (lib.isNull(this.memory.demands) || Game.time !== this.memory.demands.lastUpdated)
			{
				// init memory
				this.memory.demands = { lastUpdated: Game.time };
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
			}

			return this.memory.demands;
		}
	});
}

if (Room.prototype.hasOwnProperty('spawnEnergy') === false)
{
	Object.defineProperty(Room.prototype , "spawnEnergy" , {
		get: function ()
		{
			if (lib.isNull(this.memory.spawnEnergy) || Game.time !== this.memory.spawnEnergy.lastUpdated)
			{
				this.memory.spawnEnergy = {
					energy: 0,
					energyCapacity: 0,
					lastUpdated: Game.time
				};

				// Enumerate over spawns
				_.forEach(Room.getSpawns(this.name) , spawn =>
				{
					this.memory.spawnEnergy.energy += spawn.energy;
					this.memory.spawnEnergy.energyCapacity += spawn.energyCapacity;
				});

				this.memory.spawnEnergy.energy += this.extenderEnergy.energy;
				this.memory.spawnEnergy.energyCapacity += this.extenderEnergy.energyCapacity;
			}

			return this.memory.spawnEnergy;
		}
	});
}

if (Room.prototype.hasOwnProperty('extenderEnergy') === false)
{
	Object.defineProperty(Room.prototype , "extenderEnergy" , {
		get: function ()
		{
			if (lib.isNull(this.memory.extenderEnergy) || Game.time !== this.memory.extenderEnergy.lastUpdated)
			{
				this.memory.extenderEnergy = {
					energy: 0 ,
					energyCapacity: 0 ,
					lastUpdated: Game.time
				};

				_.forEach(Room.getStructuresType(this.name , STRUCTURE_EXTENSION) , ex =>
				{
					this.memory.extenderEnergy.energy += ex.energy;
					this.memory.extenderEnergy.energyCapacity += ex.energyCapacity;
				});
			}

			return this.memory.extenderEnergy;
		}
	});
}

if (Room.prototype.hasOwnProperty('containerEnergy') === false)
{
	Object.defineProperty(Room.prototype , "containerEnergy" , {
		get: function ()
		{
			if (lib.isNull(this.memory.containerEnergy) || Game.time !== this.memory.containerEnergy.lastUpdated)
			{
				this.memory.containerEnergy = {
					energy: 0 ,
					energyCapacity: 0 ,
					lastUpdated: Game.time
				};

				_.forEach(Room.getStructuresType(this.name , STRUCTURE_CONTAINER) , ex =>
				{
					result.energy += ex.store[RESOURCE_ENERGY];
					result.energyCapacity += ex.storeCapacity;
				});
			}
		}
	});
}

if (Room.prototype.hasOwnProperty('storageEnergy') === false)
{
	Object.defineProperty(Room.prototype , "storageEnergy" , {
		get: function ()
		{
			if (lib.isNull(this.memory.storageEnergy) || Game.time !== this.memory.storageEnergy.lastUpdated)
			{
				this.memory.storageEnergy = {
					energy: 0 ,
					energyCapacity: 0 ,
					lastUpdated: Game.time
				};

				_.forEach(Room.getStructuresType(this.name , STRUCTURE_STORAGE) , ex =>
				{
					result.energy += ex.store[RESOURCE_ENERGY];
					result.energyCapacity += ex.storeCapacity;
				});
			}
		}
	});
}

if (Room.prototype.hasOwnProperty('energy') === false)
{
	Object.defineProperty(Room.prototype , "energy" , {
		get: function ()
		{
			if (lib.isNull(this.memory.energy) || Game.time !== this.memory.energy.lastUpdated)
			{
				this.memory.storageEnergy = {
					energy: 0 ,
					energyCapacity: 0 ,
					lastUpdated: Game.time
				};

				result.energy += this.containerEnergy.energy;
				result.energyCapacity += this.containerEnergy.energyCapacity;

				result.energy += this.storageEnergy.energy;
				result.energyCapacity += this.storageEnergy.energyCapacity;
			}
		}
	});
}

if (Room.prototype.hasOwnProperty('controllerLevel') === false)
{
	Object.defineProperty(Room.prototype , "controllerLevel" , {
		get: function ()
		{
			return Room.getControllerLevel(this.name);
		}
	});
}

if (Room.prototype.hasOwnProperty('relation') === false)
{
	Object.defineProperty(Room.prototype , "relation" , {
		get: function ()
		{
			if (lib.isNull(this.memory.relation) || Game.time !== this.memory.relation.lastUpdated)
			{
				this.memory.relation = {
					relation: C.RELATION_NEUTRAL ,
					lastUpdated: Game.time
				};
				if (!lib.isNull(this.controller))
				{
					this.memory.relation.relation = diplomacyManager.status(this.controller.owner);
				}
				else
				{
					this.memory.relation.relation = C.RELATION_NEUTRAL;
				}
			}

			return this.memory.relation.relation;
		}
	});
}

if (Room.prototype.hasOwnProperty('maxHarvesters') === false)
{
	Object.defineProperty(Room.prototype , "maxHarvesters" , {
		get: function ()
		{
			if (lib.isNull(this.memory.maxHarvesters) || Game.time !== this.memory.maxHarvesters.lastUpdated)
			{
				this.memory.maxHarvesters = {
					max: 0 ,
					lastUpdated: Game.time
				};

				_.forEach(Room.getSources(this.name) , s =>
				{
					this.memory.maxHarvesters.max += s.getMaxHarvesters();
				});
			}
		}
	});
}

if (Room.prototype.hasOwnProperty('rsl') === false)
{
	Object.defineProperty(Room.prototype , "rsl" , {
		get: function ()
		{
			if (lib.isNull(this.memory.rsl) || Game.time !== this.memory.rsl.lastUpdated)
			{
				this.memory.rsl = {
					rsl: 0 ,
					lastUpdated: Game.time
				};

				if (this.isMine)
				{
					let numExtensions = Room.getStructureIdsType(this.name, STRUCTURE_EXTENSION).length;
					if (numExtensions < 5)
					{
						this.memory.rsl.rsl = 1;
					}
					else if (numExtensions < 10)
					{
						this.memory.rsl.rsl= 2;
					}
					else if (numExtensions < 20)
					{
						this.memory.rsl.rsl = 3;
					}
					else if (numExtensions < 30)
					{
						this.memory.rsl.rsl = 4;
					}
					else if (numExtensions < 40)
					{
						this.memory.rsl.rsl = 5;
					}
					else if (numExtensions < 50)
					{
						this.memory.rsl.rsl = 6;
					}
					else if (numExtensions < 60)
					{
						this.memory.rsl.rsl = 7;
					}
					else
					{
						this.memory.rsl.rsl = 8;
					}
				}
			}
		}
	});
}

if (Room.prototype.hasOwnProperty('maxUnits') === false)
{
	Object.defineProperty(Room.prototype , "maxUnits" , {
		get: function ()
		{
			if (lib.isNull(this.memory.maxUnits) || Game.time !== this.memory.maxUnits.lastUpdated)
			{
				this.memory.maxUnits = {
					units: [] ,
					lastUpdated: Game.time
				};

				this.memory.maxUnits.units.worker = this.controllerLevel < 4 ? 10 : 4;
				this.memory.maxUnits.units.harvester = Room.getSourceIds(this.name) * 2;
				this.memory.maxUnits.units.rharvester = this.memory.rHarvestTargets.length * 2;
				this.memory.maxUnits.units.hauler = 4;
				this.memory.maxUnits.units.claimer = this.claimSpawn * 2;
				this.memory.maxUnits.units.guard = 0;
				this.memory.maxUnits.units.rangedGuard = 0;
				this.memory.maxUnits.units.heal = 0;
				this.memory.maxUnits.units.scout = 1;
			}

			return this.memory.maxUnits.units;
		}
	});
}

if (Room.prototype.hasOwnProperty('claimSpawn') === false)
{
	Object.defineProperty(Room.prototype , "claimSpawn" , {
		get: function ()
		{
			return _(Memory.claims ).filter('spawnRoom', this.name).size();
		}
	});
}

/***********************************************************************************************************************
 * Export
 */
module.exports = function ()
{
};