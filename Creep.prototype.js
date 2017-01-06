//-------------------------------------------------------------------------
// prototype.creep
//-------------------------------------------------------------------------
// memory
// ------------------------------------------------------------------------
// motive: {}
//      room: string room name, the home room of the creep
//      motivation: string motivation name, the motivation the creep is assigned to
//      need:  string need name, the need the creep is assigned to
// unit: string - unit type
//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------

Creep.prototype.moveToRange = function (target, range)
{
	if (target.pos.inRangeTo(this.pos, range - 1))
	{
		this.moveTo(this.pos.x + this.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y);
		return true;
	}
	else if (target.pos.inRangeTo(this.pos, range))
	{
		return true;
	}
	else
	{
		this.moveTo(target);
		return true;
	}
};

Creep.prototype.avoidHostile = function (range)
{
	if (typeof(range) === 'undefined')
	{
		range = 3;
	}
	let inRange = this.pos.findInRange(Game.HOSTILE_CREEPS, range);
	if (inRange && inRange.length)
	{
		let target = this.pos.findNearest(Game.HOSTILE_CREEPS);
		if (target)
		{
			this.moveAwayFromTarget(target);
			return true;
		}
	}
	return false;
};

Creep.prototype.moveAwayFromTarget = function (target)
{
	let avoid = this.pos.getDirectionTo(target);
	this.move((avoid + 4) % 8);
};

Creep.prototype.rendezvous = function (range)
{
	let flags = this.room.find(FIND_FLAGS, {'name': 'Flag1'});

	//console.log(JSON.stringify(flags));
	if (this.memory.rendezvous)
	{
		this.moveToRange(this.memory.rendezvous, range);
	}
	else if (flags && flags.length)
	{
		let flag = flags[0];
		this.moveToRange(flag, range);
	}
	else
	{
		this.moveToRange(this.getSpawn(), range);
	}
};

Creep.prototype.carrying = function()
{
    let result = 0;

    if (this.carryCapacity > 0)
    {
        result = _.sum(this.carry);
    }

    return result;
};

Creep.prototype.percentFull = function()
{
    let percent = 0;

    if (this.carryCapacity > 0)
    {
        percent = (this.carrying / this.carryCapacity) * 10000 / 100
    }

    return percent;
};

Creep.prototype.getSpawn = function()
{
	let creepSpawn = lib.nullProtect(Game.spawns[this.memory.spawn], this.pos.findClosestByPath(FIND_MY_SPAWNS, { ignoreCreeps: true }));
	return creepSpawn;
};

Creep.prototype.getHasPart = function (part)
{
	let result = false;
	this.body.forEach(function (i) {
		if (i.type == part)
		{
			result = true;
		}
	}, this);
	return result;
};

Creep.prototype.initMotive = function()
{
	if (lib.isNull(this.memory.motive))
	{
		//cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [this.memory.motive.room, this.memory.motive.motivation, this.memory.unit]));

		this.memory.motive = {};
		this.memory.motive.room = this.room.name;
		this.memory.motive.motivation = "";
		this.memory.motive.need = "";
	}
};

Creep.prototype.assignMotive = function (roomName, motivationName, needName)
{
	// dirty the cache for the before and after values
	cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [this.memory.motive.room, this.memory.motive.motivation, this.memory.unit]));
	cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [roomName, motivationName, this.memory.unit]));


	// assign the new motive
	this.say(needName);
	this.memory.motive.room = roomName;
	this.memory.motive.motivation = motivationName;
	this.memory.motive.need = needName;
};

Creep.prototype.deassignMotive = function (roomName)
{
	// dirty the cache for the before and after values
	cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [this.memory.motive.room, this.memory.motive.motivation, this.memory.unit]));
	cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [roomName, "", this.memory.unit]));


	this.say("Done!");
	if (!lib.isNull(roomName))
		this.memory.motive.room = roomName;
	this.memory.motive.motivation = "";
	this.memory.motive.need = "";
};

Creep.prototype.assignToLongDistanceHarvest = function ()
{
    if (this.memory.unit != "worker")
        return;
    
	let room = roomManager.getLongDistanceHarvestTarget();
	// dirty the cache for the before and after values
	cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [this.memory.motive.room, this.memory.motive.motivation, this.memory.unit]));
	cacheManager.dirtyMem("cacheFunction", cacheManager.genKey("strategyManager.countRoomMotivationUnits", [room, "", this.memory.unit]));

	if (!lib.isNull(room) && room != "")
	{
		this.memory.motive.room = room;
		this.memory.sourceId = "";
		this.memory.sourceType = 0;
		this.deassignMotive();

	}
};

/*
 * NOTES: sentences are broken down using | to seperate pieces
 *        public will default to true
 *
 * Creep.prototype.sing(sentence, public)
 *   creep will sing a different part of sentence per tick
 */
Creep.prototype.sing = function(sentence, public){
	if(public === undefined)public = false;
	let words = sentence.split(" ");
	this.say(words[Game.time % words.length], public);
};

Creep.prototype.resetSource = function ()
{
	this.memory.sourceId = "";
	this.memory.sourceType = 0;
};

module.exports = function() {};