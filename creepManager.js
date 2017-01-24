//------------------------------------------------------------------------------
// creepManager
//------------------------------------------------------------------------------
"use strict";

module.exports =
{
	//--------------------------------------------------------------------------
	// Declarations
	//--------------------------------------------------------------------------

	//--------------------------------------------------------------------------
	// top level functions
	//--------------------------------------------------------------------------

	// these functions differ than the ones in Room in that these do not require visibility of the room
	// and they do not require the unit to be in the room, just assigned to whatever is specified

	/**
	 * Returns an array of creeps assigned to that room.
	 * NOTE: This function is used in cache building, don't cache it.
	 * @param roomName
	 */
	getRoomCreepsRaw: function (roomName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room === roomName;
		});
		return result;
	} ,

	countRoomUnits: function (roomName , unitName)
	{
		let units = _.has(global, "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName] : [];
		return units.length;
	},

	countHomeRoomUnits: function (roomName , unitName)
	{
		let units = _.has(global, "cache.homeRooms." + roomName + ".units." + unitName) ? global.cache.homeRooms[roomName].units[unitName] : [];
		return units.length;
	},

	getRoomUnits: function (roomName , unitName)
	{
		let units = _.has(global, "cache.rooms." + roomName + ".units." + unitName) ? global.cache.rooms[roomName].units[unitName] : [];
		return units;
	},

	/**
	 * returns the number of units assigned to the given motivationName
	 * @param roomName
	 * @param motivationName
	 * @param unitName
	 * @returns {*}
	 */
	countRoomMotivationUnits: function (roomName , motivationName , unitName)
	{
		// new cache
		return Memory.rooms[roomName].cache.unitMotive[motivationName].units[unitName];
	},

	getRoomMotivationCreeps: function (roomName, motivationName)
	{
		let result = _.filter(global.cache.rooms[roomName].creeps , function (creep)
		{
			return creep.memory.motive.motivation === motivationName;
		});
		return result;
	},

	countRoomMotivationNeedUnits: function (roomName, motivationName , needName , unitName)
	{
		if (!lib.isNull(Memory.rooms[roomName].cache.unitMotive[motivationName].needs[needName]))
			return Memory.rooms[roomName].cache.unitMotive[motivationName].needs[needName].units[unitName];
		else
			return 0;
	},

	countRoomAssignedUnits: function (roomName, unitName)
	{
		let result = this.getRoomAssignedUnits(roomName, unitName).length;
		return result;
	},

	getRoomAssignedUnits: function (roomName, unitName)
	{
		let result = _.filter(global.cache.rooms[roomName].units[unitName] , function (creep)
		{
			return creep.memory.motive.motivation != "";
		});
		return result;
	},

	countRoomUnassignedUnits: function (roomName, unitName)
	{
		let result = this.getRoomUnassignedUnits(roomName, unitName).length;

		return result;
	},

	getRoomUnassignedUnits: function (roomName, unitName)
	{
		let result = _.filter(global.cache.rooms[roomName].units[unitName] , function (creep)
		{
			return creep.memory.motive.motivation === "";
		});

		return result;
	},

	findRoomUnassignedUnit: function(roomName, unitName)
	{
		return this.getRoomUnassignedUnits(roomName, unitName)[0];
	},

	countCreepsOnSource: function (sourceId)
	{
		let result = this.getCreepsOnSource(sourceId).length;
		return result;
	},

	getCreepsOnSource: function (sourceId)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return !lib.isNull(creep.memory.sourceId) && creep.memory.sourceId === sourceId;
		});
		return result;
	},

	handleLostCreeps: function ()
	{

		_.forEach(Game.rooms, function (r, k){
			// handle lost creeps
			r.handleLostCreeps();
		});
	}

};