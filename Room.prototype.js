//-------------------------------------------------------------------------
// Room.prototype
//-------------------------------------------------------------------------

/***********************************************************************************************************************
 * functions
 */

/**
 * Updates the memory structure cache to reduce the number of Room.find() calls for structures
 */
Room.prototype.updateStructureCache = function (forceRefresh)
{
	// don't require forceRefresh to be passed
	if (lib.isNull(forceRefresh)) forceRefresh = false;
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
			if (!lib.isNull(CONTROLLER_STRUCTURES[s]) && CONTROLLER_STRUCTURES[s][roomLevel] <= roomLevel)
			{
				//console.log(`Checking ${s}...`);
				let foundStructures = room.find(FIND_STRUCTURES , { filter: function (st)
				{
					return st.structureType == s;
				}});
				//console.log(`Found ${foundStructures}...`);


				// map structure ids to the memory object
				structures[s] = _.map(foundStructures, function (st) {
					return st.id;
				});
			}
		});
	}
};

Room.prototype.updateSourceCache = function (forceRefresh)
{
	// don't require forceRefresh to be passed
	if (lib.isNull(forceRefresh)) forceRefresh = false;
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

Room.prototype.initMemCache = function (forceRefresh)
{
	// don't require forceRefresh to be passed
	if (lib.isNull(forceRefresh)) forceRefresh = true;

	// insure the memory object exists
	if (lib.isNull(this.memory.cache) || forceRefresh)
	{
		this.memory.cache = {};
		forceRefresh = true;
	}

	this.updateStructureCache(forceRefresh);
	this.updateSourceCache(forceRefresh);
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

		let numContainers = lib.nullProtect(this.memory.cache.structures[STRUCTURE_CONTAINER], []).length;

		if (numContainers >= this.memory.cache.sources.length && strategyManager.countRoomUnits(this.name, "harvester") > 0)
		{
			let numStorage = lib.nullProtect(this.memory.cache.structures[STRUCTURE_STORAGE], []).length;
			result = C.ROOM_ENERGYPICKUPMODE_CONTAINER;
			if (numStorage > 0)
			{
				result = C.ROOM_ENERGYPICKUPMODE_STORAGE;
			}
		}
	}

	this.memory.energyPickupMode = result;
};

Room.prototype.getControllerLevel = function ()
{
	let result = 0;
	if (!lib.isNull(this.controller))
	{
		result = this.controller.level;
	}
	return result;
};

/***********************************************************************************************************************
 * Resource related functions
 *
 */

Room.prototype.getResources = function ()
{
	let debug = false;
	let resources = {};
	// determine room resources ----------------------------------------------------------------------------
	// energy
	resources.spawnEnergy = this.getSpawnEnergy();

	// get room collector status
	resources.controllerStatus = this.getControllerStatus();

	// output info
	lib.log("---- Room Resources: " + this.name, debug);
	lib.log('  Spawn Energy: ' + resources.spawnEnergy.energy + '/' + resources.spawnEnergy.energyCapacity + ' Controller Level: ' + resources.controllerStatus.level + ' ' + resources.controllerStatus.progress + '/' + resources.controllerStatus.progressTotal + ' Downgrade: ' + resources.controllerStatus.ticksToDowngrade, debug);

	// get unit resources
	resources.units = {};
	for (let unitName in units)
	{

		resources.units[unitName] = {};
		resources.units[unitName].total = strategyManager.countRoomUnits(this.name, unitName);
		resources.units[unitName].allocated = 0;
		resources.units[unitName].unallocated = resources.units[unitName].total;
		resources.units[unitName].unassigned = strategyManager.countRoomUnassignedUnits(this.name, unitName);
		resources.units[unitName].assigned = strategyManager.countRoomAssignedUnits(this.name, unitName);
		lib.log("  " + unitName + " total: " + resources.units[unitName].total
			+ " Assigned/UnAssigned: " + resources.units[unitName].assigned
			+ "/" + resources.units[unitName].unassigned, debug);
	}

	return resources;
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
		if (spawn.room.name == this.name)
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

Room.prototype.getControllerStatus = function ()
{
	let result = {};

	// Enumerate over spawns
	let controller = this.controller;

	if (!lib.isNull(controller) && controller.my)
	{
		result.progress = controller.progress;
		result.progressTotal = controller.progressTotal;
		result.ticksToDowngrade = controller.ticksToDowngrade;
		result.level = controller.level;
	} else {
		result.progress = 0;
		result.progressTotal = 0;
		result.ticksToDowngrade = 0;
		result.level = 0;
	}

	return result;
};

/***********************************************************************************************************************
 * Creep finding functions
 *
 */

/**
 * count creeps present in a room
 */
Room.prototype.countCreeps = function ()
{
	let result = this.getCreeps().length;

	return result;
};

/**
 * returns creeps present in a room
 */
Room.prototype.getCreeps = function ()
{
	let roomName = this.name;
	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName;
	});
	return result;
};

/**
 * returns number of creeps in room of a unit type
 * @param unitName
 */
Room.prototype.countUnits = function (unitName)
{
	let result = this.getUnits(unitName).length;
	return result;
};

/**
 * returns creeps in room of unit type
 * @param unitName
 */
Room.prototype.getUnits = function (unitName)
{
	let roomName = this.name;
	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName
		&& creep.memory.unit == unitName;
	});
	return result;
};

Room.prototype.countMotivationCreeps = function (motivationName)
{
	let result = this.getRoomMotivationCreeps(motivationName).length;
	return result;
};

Room.prototype.getMotivationCreeps = function (motivationName)
{
	let roomName = this.name;
	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName
			&& creep.memory.motive.room == roomName
			&& creep.memory.motive.motivation == motivationName;
	});
	return result;
};

Room.prototype.countMotivationNeedCreeps = function (motivationName , needName)
{
	let result = this.getMotivationNeedCreeps(motivationName , needName).length;
	return result;
};

Room.prototype.getMotivationNeedCreeps = function (motivationName , needName)
{
	let roomName = this.name;
	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName
			&& creep.memory.motive.room == roomName
			&& creep.memory.motive.motivation == motivationName
			&& creep.memory.motive.need == needName;
	});
	return result;
};

Room.prototype.countMotivationNeedUnits = function (motivationName , needName , unitName)
{
	let result = this.getMotivationNeedUnits(motivationName , needName , unitName).length;
	return result;
};

Room.prototype.getMotivationNeedUnits = function (motivationName , needName , unitName)
{
	let roomName = this.name;
	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName
			&& creep.memory.motive.room == roomName
			&& creep.memory.motive.motivation == motivationName
			&& creep.memory.motive.need == needName
			&& creep.memory.unit == unitName;
	});
	return result;
};

Room.prototype.countAssignedUnits = function (unitName)
{
	let result = this.getAssignedUnits(unitName).length;
	return result;
};

Room.prototype.getAssignedUnits = function (unitName)
{
	let roomName = this.name;
	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName
			&& creep.memory.motive.room == roomName
			&& creep.memory.motive.motivation != ""
			&& creep.memory.motive.need != ""
			&& creep.memory.unit == unitName;
	});
	return result;
};

Room.prototype.countUnassignedUnits = function (unitName)
{
	let result = this.getUnassignedUnits(unitName).length;

	return result;
};

Room.prototype.getUnassignedUnits = function (unitName)
{
	let roomName = this.name;
	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName
			&& creep.memory.motive.room == roomName
			&& creep.memory.motive.motivation == ""
			&& creep.memory.motive.need == ""
			&& creep.memory.unit == unitName;
	});

	return result;
};

Room.prototype.countLostCreeps = function ()
{
	let result = this.getLostCreeps().length;
	return result;
};

Room.prototype.getLostCreeps = function ()
{
	let roomName = this.name;

	let result = _.filter(Game.creeps , function (creep)
	{
		return creep.room.name == roomName
			&& creep.memory.motive.room != roomName;
	});

	return result;
};

Room.prototype.handleLostCreeps = function()
{
	let lostCreeps = this.getLostCreeps();
	lostCreeps.forEach(function (creep)
	{
		let exit = creep.room.findExitTo(creep.memory.motive.room);
		// and move to exit
		creep.moveTo(creep.pos.findClosestByPath(exit, { ignoreCreeps: true }));
		creep.say("Leave!");
	}, this);
};

Room.prototype.safeModeFailsafe = function ()
{
	let debug = false;
	let room = Game.rooms[this.name];
	if (room.controller.my)
	{
		let controller = room.controller;
		let hostiles = this.getAgressivesPresent(this.name);
		//safeMode	number	How many ticks of safe mode remaining, or undefined.
		let safeMode = lib.nullProtect(controller.safeMode , 0);
		//safeModeAvailable	number	Safe mode activations available to use.
		let safeModeAvailable = lib.nullProtect(controller.safeModeAvailable , 0);
		//safeModeCooldown	number	During this period in ticks new safe mode activations will be blocked, undefined if cooldown is inactive.
		let safeModeCooldown = lib.nullProtect(controller.safeModeCooldown , 0);

		if (hostiles.length && !safeMode && safeModeAvailable && !safeModeCooldown)
		{
			lib.log("!!!!!!!!!!!!!!! ACTIVATING SAFE MODE !!!!!!!!!!!!!!!", debug);
			controller.activateSafeMode();
		}
		lib.log(">>>> Safe Mode Status: Hostiles: " + hostiles.length
			+ " SafeMode: " + safeMode
			+ " SafeModeAvailable: " + safeModeAvailable
			+ " SafeModeCooldown: " + safeModeCooldown, debug);
	}
};

Room.prototype.getAgressivesPresent = function ()
{
	let room = Game.rooms[this.name];
	let hostileCreeps = room.find(FIND_HOSTILE_CREEPS , {
		filter: function (creep)
		{
			//console.log(JSON.stringify(creep.body));
			return _.find(creep.body , function (p)
			{
				return p.type == ATTACK || p.type == RANGED_ATTACK || p.type == CLAIM;
			});
		}
	});
	return hostileCreeps;
};

Room.prototype.motivateTowers = function ()
{
	if (this.controller.my)
	{
		// find all towers
		let towers = this.find(FIND_STRUCTURES , {
			filter: function (s)
			{
				return s.structureType == STRUCTURE_TOWER
			}
		});
		// for each tower
		towers.forEach(function (tower)
		{
			tower.autoAttack();
			tower.autoCreepHeal();
			tower.autoRepair();
		} , this);
	}
};

Room.prototype.updateThreat = function ()
{
	let numAggressives = this.getAgressivesPresent().length;
	let timeSinceSeen;

	if (lib.isNull(this.memory.threat))
	{
		this.memory.threat = {};
		this.memory.threat.lastSeen = 0;
		this.memory.threat.count
	}

	timeSinceSeen = Game.time - this.memory.threat.lastSeen;

	// update enemy count
	if (numAggressives > this.memory.threat.count)
		this.memory.threat.count = numAggressives;

	// update based on time
	if (numAggressives > 0)
		this.memory.threat.lastSeen = Game.time;
	else if (timeSinceSeen > config.garrisonTime)
	{
		this.memory.threat.count = 0;
	}

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
	let creeps = _.filter(Game.creeps, (c) => c.room.name == this.name);
	creeps = _.sortBy(creeps, function(c){return (c.pos.x + (c.pos.y*50))});

	for(let i in creeps){
		creeps[i].say(words[i % words.length], public);
	}
};

/***********************************************************************************************************************
 * Properties
 */

/**
 * Returns the mineral type of the room.
 * Stores it in memory if not already stored.
 */
Object.defineProperty(Room.prototype, 'mineralType', {
	get: function() {
		if (this == undefined || this.name == undefined)
			return undefined;
		if (!this._mineralType) {
			if (!this.memory.mineralType) {
				this.memory.mineralType = (this.find(FIND_MINERALS)[0] || {}).mineralType;
			}
			this._mineralType = this.memory.mineralType;
		}
		return this._mineralType;
	},
	enumerable: false,
	configurable: true
});

/**
 * Returns the mineral object in the room.
 * Stores the id in memory if not already stored.
 */
Object.defineProperty(Room.prototype, 'mineral', {
	get: function() {
		if (this == undefined || this.name == undefined)
			return undefined;
		if (!this._mineral) {
			if (this.memory.mineralId === undefined) {
				let [mineral] = this.find(FIND_MINERALS);
				if (!mineral) {
					return this.memory.mineralId = null;
				}
				this._mineral = mineral;
				this.memory.mineralId = mineral.id;
			} else {
				this._mineral = Game.getObjectById(this.memory.mineralId);
			}
		}
		return this._mineral;
	},
	enumerable: false,
	configurable: true
});

/**
 * Returns the reaction type of the room. Shortcut to Memory.rooms[roomName].reactionType.
 * This value gets set by the reaction type menu in the storageContents function.
 */
Object.defineProperty(Room.prototype, 'reactionType', {
	get: function() {
		if (this == undefined || this.name == undefined)
			return undefined;
		if (!this._reactionType) {
			this._reactionType = this.memory.reactionType;
		}
		return this._reactionType;
	},
	enumerable: false,
	configurable: true
});



module.exports = function() {};