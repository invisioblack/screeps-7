"use strict";

/**
 * Adapted from Vaejor's script, thanks!
 * @param target
 * @param options
 * @returns {number}
 */
Creep.prototype.travelTo = function (target , options)
{
	let moveResult = ERR_TIRED;
	if (this.fatigue === 0)
	{
		let movePerformed = (
			( this.memory.movePosLast === undefined )
			||
			( this.pos.isEqualTo(RoomPosition.fromMemory(this.memory.movePosLast)) === false )
		);
		let recalculatePath = ( ( Game.time - ( this.memory.movePosLastTime || Game.time ) ) >= 3 );

		if (movePerformed === true)
		{
			this.memory.movePosLast = this.pos.toMemory();
			this.memory.movePosLastTime = Game.time;
		}


			options = _.assign({
				ignoreCreeps: recalculatePath === false ,
				reusePath: recalculatePath ? 0 : 1500
			} , options);


		moveResult = this.moveTo(target , options);

		let nextPos = this.getNextPathPosition();

		/*
		let nudgeResult = null;
		if (( nextPos !== undefined ) && ( nextPos.isEqualTo(this.pos) === false ))
		{
			let blockingCreep = nextPos.creep;
			if (blockingCreep !== undefined)
			{
				if (( blockingCreep.memory !== undefined ) && ( ( blockingCreep.memory.action === 'idle' ) || ( blockingCreep.memory.action === 'active' ) ))
				{
					nudgeResult = blockingCreep.doNudge(this);
				}
			}
		}
*/
		if (moveResult === ERR_NO_PATH)
		{
			if (
				( ( this.target instanceof RoomPosition ) && ( this.pos.roomName !== this.target.roomName ) )
				||
				( ( this.target instanceof RoomObject ) && ( this.pos.roomName !== this.target.pos.roomName ) )
			)
			{
				if (( this.pos.x <= 1 ) || ( this.pos.x >= 48 ) || ( this.pos.y <= 1 ) || ( this.pos.y >= 48 ))
				{
					let dirs = [];
					if (this.pos.x <= 1)
					{
						dirs = [2 , 3 , 4 , 2 , 3 , 4 , 2 , 3 , 4 , 2 , 3 , 4 , 2 , 3 , 4 , 1 , 5 ,];
					}
					else if (this.pos.x >= 48)
					{
						dirs = [6 , 7 , 8 , 6 , 7 , 8 , 6 , 7 , 8 , 6 , 7 , 8 , 6 , 7 , 8 , 5 , 1 ,];
					}
					else if (this.pos.y <= 1)
					{
						dirs = [4 , 5 , 6 , 4 , 5 , 6 , 4 , 5 , 6 , 4 , 5 , 6 , 4 , 5 , 6 , 3 , 7 ,];
					}
					else if (this.pos.y >= 48)
					{
						dirs = [8 , 1 , 2 , 8 , 1 , 2 , 8 , 1 , 2 , 8 , 1 , 2 , 8 , 1 , 2 , 7 , 3 ,];
					}
					moveResult = this.move(_.sample(dirs));
				}
			}
			else
			{
				//utils.log( 'Creep.prototype.moveTo2(): ' + this + ': moveResult is ERR_NO_PATH (current role: ' + this.role + ', position: ' + this.pos + ', this.target: ' + this.target + '; this.target.pos: ' + this.target.pos + ')' );
			}
		}
		else if (( moveResult !== OK ) && ( moveResult !== ERR_TIRED ))
		{
			//utils.log( 'Creep.prototype.moveTo2(): ' + this + ': moveResult is not OK: ' + moveResult + ' (current role: ' + this.role + ')' );
		}
		return moveResult;
	}
};

/**
 * by Vaejor
 * @returns {*}
 */
Creep.prototype.getNextPathPosition = function() {
	if ( this.memory._move !== undefined ) {
		let path = this.memory._move.path;
		if ( ( path !== undefined ) && ( path !== '' ) ) {
			let xy = Number.parseInt( path.substring( 0, 4 ), 10 );
			let x = Math.floor( xy / 100 );
			let y = xy % 100;
			return this.room.getPositionAt( x, y );
		}
	}
	return undefined;
};

/**
 *
 * @param target
 * @param range
 * @returns {boolean}
 */
Creep.prototype.moveToRange = function (target , range)
{
	if (target.pos.inRangeTo(this.pos , range - 1))
	{
		this.travelTo(this.pos.x + this.pos.x - target.pos.x , creep.pos.y + creep.pos.y - target.pos.y);
		return true;
	}
	else if (target.pos.inRangeTo(this.pos , range))
	{
		return true;
	}
	else
	{
		this.travelTo(target);
		return true;
	}
};

// TODO: work on this
Creep.prototype.avoidHostile = function (range = 4)
{
	if (this.room.memory.threat.threats.length)
	{
		let inRange = this.pos.findInRange(this.room.memory.threat.threats , range);
		if (inRange && inRange.length)
		{
			let target = this.findClosestByRange(this.room.threat.threats);
			if (target)
			{
				this.moveAwayFromTarget(target);
				this.say("Aahh!!", true);
				return true;
			}
		}
	}
	return false;
};

Creep.prototype.moveAwayFromTarget = function (target)
{
	let avoid = this.pos.getDirectionTo(target);
	this.move((avoid + 4) % 8);
};

Creep.prototype.rendezvous = function (target , range)
{
	this.moveToRange(target , range);
};

Creep.prototype.getOffEdge = function ()
{
	let moveResult = -1;
	if (( this.pos.x < 1 ) || ( this.pos.x > 48 ) || ( this.pos.y < 1 ) || ( this.pos.y > 48 ))
	{
		let dirs = [];
		if (this.pos.x <= 1)
		{
			dirs = [2 , 3 , 4 , 2 , 3 , 4 , 2 , 3 , 4 , 2 , 3 , 4 , 2 , 3 , 4 , 1 , 5 ,];
		}
		else if (this.pos.x >= 48)
		{
			dirs = [6 , 7 , 8 , 6 , 7 , 8 , 6 , 7 , 8 , 6 , 7 , 8 , 6 , 7 , 8 , 5 , 1 ,];
		}
		else if (this.pos.y <= 1)
		{
			dirs = [4 , 5 , 6 , 4 , 5 , 6 , 4 , 5 , 6 , 4 , 5 , 6 , 4 , 5 , 6 , 3 , 7 ,];
		}
		else if (this.pos.y >= 48)
		{
			dirs = [8 , 1 , 2 , 8 , 1 , 2 , 8 , 1 , 2 , 8 , 1 , 2 , 8 , 1 , 2 , 7 , 3 ,];
		}
		moveResult = this.move(_.sample(dirs));
		this.say("Move!");
	}
};

/**
 *
 * @param part
 * @returns {boolean}
 */
Creep.prototype.getHasPart = function (part)
{
	let result = false;
	this.body.forEach(function (i)
	{
		if (i.type === part)
		{
			result = true;
		}
	} , this);
	return result;
};

/**
 *
 */
Creep.prototype.initMotive = function ()
{
	this.memory.motive = {};
	this.memory.motive.room = this.room.name;
	this.memory.motive.motivation = "";
	this.memory.motive.need = "";
};

/**
 *
 * @param roomName
 * @param motivationName
 * @param needName
 */
Creep.prototype.assignMotive = function (roomName , motivationName , needName)
{
	// if the creep is assigned, remove him from the cache
	if (this.memory.motive.motivation !== "")
	{
		if (!lib.isNull(global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation]))
		{
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].units[this.memory.unit]--;
			if (!lib.isNull(global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need]))
			{
				global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need].units[this.memory.unit]--;
			}
		}
	}

	// assign the new motive
	this.say(needName);
	this.memory.motive.room = roomName;
	this.memory.motive.motivation = motivationName;
	this.memory.motive.need = needName;
	this.resetSource();

	// add to the cache
	if (this.memory.motive.motivation !== "")
	{
		if (lib.isNull(global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation]))
		{
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation] = {};
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].units = {};
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs = {};
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].units[this.memory.unit] = 0;
		}
		global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].units[this.memory.unit]++;

		if (lib.isNull(global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need]))
		{
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need] = {};
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need].units = {};
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need].units[this.memory.unit] = 0;
		}
		global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need].units[this.memory.unit]++;
	}
};

/**
 *
 * @param roomName
 */
Creep.prototype.deassignMotive = function (roomName)
{
	let debug = false;
	lib.log(`Creep: ${this.name} Room/target: ${roomLink(this.room.name)}/${roomName} Motive: ${this.memory.motive.motivation}/${this.memory.motive.need}` , debug);
	this.say("Done!");

	// if the creep is assigned, remove him from the cache
	if (this.memory.motive.motivation !== "")
	{
		if (!lib.isNull(global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation]))
		{
			global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].units[this.memory.unit]--;
			if (!lib.isNull(global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need]))
			{
				global.cache.rooms[this.name].unitMotive[this.memory.motive.motivation].needs[this.memory.motive.need].units[this.memory.unit]--;
			}
		}
	}

	if (!lib.isNull(roomName) && roomName != "")
	{
		Room.updateUnitCache(this.memory.motive.room);
		this.memory.motive.room = roomName;
	}
	this.memory.motive.motivation = "";
	this.memory.motive.need = "";
	this.resetSource();
};

/**
 *
 * @param roomName
 */
Creep.prototype.assignToRoom = function (roomName)
{
	this.memory.homeRoom = roomName;
	this.deassignMotive(roomName);
};

/*
 * NOTES: sentences are broken down using | to seperate pieces
 *        public will default to true
 *
 * Creep.prototype.sing(sentence, public)
 *   creep will sing a different part of sentence per tick
 */
Creep.prototype.sing = function (sentence , pub)
{
	if (pub === undefined)
	{
		pub = false;
	}
	let words = sentence.split(" ");
	this.say(words[Game.time % words.length] , pub);
};

/**
 *
 */
Creep.prototype.resetSource = function ()
{
	this.memory.sourceId = "";
	this.memory.sourceType = 0;
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 * properties
 */

if (Creep.prototype.hasOwnProperty('carrying') === false)
{
	Object.defineProperty(Creep.prototype , "carrying" , {
		get: function ()
		{
			let result = 0;

			if (this.carryCapacity > 0)
			{
				result = _.sum(this.carry);
			}

			return result;
		}
	});
}

module.exports = function ()
{
};