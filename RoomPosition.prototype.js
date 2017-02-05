"use strict";

/**
 * by WarInternal
 * @returns {*}
 */
RoomPosition.prototype.isEnclosed = function ()
{
	let room = Game.rooms[this.roomName];
	let exits = room.find(FIND_EXIT);
	let opts = {
		plainCost: 1 ,
		swampCost: 1 ,
		maxRooms: 1 ,
		roomCallback: function (r)
		{
			let cm = new PathFinder.CostMatrix;
			_(room.find(FIND_STRUCTURES))
			// .filter(i => i.structureType === STRUCTURE_RAMPART || i.structureType === STRUCTURE_WALL)
				.filter(i => i instanceof StructureRampart || i instanceof StructureWall)
				.each(s => cm.set(s.pos.x , s.pos.y , 255)).commit();
			return cm;
		}
	};
	return this.search(
		_.map(exits , e => ({pos: e , range: 0})) ,
		opts
	).incomplete;
};

/**
 * By Vaejor
 * @param goals
 * @param opts
 * @returns {*}
 */
RoomPosition.prototype.search = function (goals , opts)
{
	return PathFinder.search(this , goals , opts);
};

/**
 * By Vaejor
 * @param memoryData
 * @returns {*}
 */
RoomPosition.fromMemory = function (memoryData)
{
	if (( memoryData === undefined ) || ( memoryData === null ) || ( typeof memoryData !== 'string' ) || ( memoryData.length < 3 ))
	{
		return undefined;
	}
	return new RoomPosition(
		RoomPosition.letterToPos(memoryData.charCodeAt(0)) ,
		RoomPosition.letterToPos(memoryData.charCodeAt(1)) ,
		memoryData.substring(2)
	);
};

/**
 * By Vaejor
 * @param charCode
 * @returns {number}
 */
RoomPosition.letterToPos = function (charCode)
{
	// 97 is 'a'
	// 40 is 65('A') - 25(to reduce the second half to 0..24 range)
	return ( charCode - ( ( charCode >= 97 ) ? 97 : 40 ) );
};

/**
 * By Vaejor
 * @param pos
 * @returns {string}
 */
RoomPosition.posToLetter = function (pos)
{
	// 97 is 'a'
	// 40 is 65('A') - 25(to reduce the second half to 0..24 range)
	return String.fromCharCode(pos + ( ( pos < 25 ) ? 97 : 40 ));
};

/**
 * By Vaejor
 * @returns {string}
 */
RoomPosition.prototype.toMemory = function ()
{
	return RoomPosition.posToLetter(this.x)
		+ RoomPosition.posToLetter(this.y)
		+ this.roomName;
};