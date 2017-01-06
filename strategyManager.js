//------------------------------------------------------------------------------
// strategyManager
//------------------------------------------------------------------------------

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

	countUnits: function (unitName)
	{
		let result = this.getUnits(unitName).length;
		return result;
	} ,

	getUnits: function (unitName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.unit == unitName;
		});
		return result;
	} ,

	countRoomUnits: function (roomName , unitName)
	{
		let result = this.getRoomUnits(roomName , unitName).length;
		return result;
	} ,

	getRoomUnits: function (roomName , unitName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room == roomName
				&& creep.memory.unit == unitName;
		});
		return result;
	} ,

	/**
	 * returns the number of units assigned to the given motivationName
	 * @param roomName
	 * @param motivationName
	 * @param unitName
	 * @returns {*}
	 */
	countRoomMotivationUnits: function (roomName , motivationName , unitName)
	{
		let useCache = true;
		let result, realResult;

		if (!useCache)
			realResult = this.getRoomMotivationUnits(roomName, motivationName, unitName).length;

		let key = cacheManager.genKey("strategyManager.countRoomMotivationUnits" , arguments);
		let cache = cacheManager.fetchMem("cacheFunction" , key);

		if (!cache.valid)
		{
			result = this.getRoomMotivationUnits(roomName, motivationName, unitName).length;
			cacheManager.storeMem("cacheFunction" , key , result , Game.time);
		}
		else
		{
			result = cache.value;
		}

		if (!useCache)
		{
			lib.log(`Cache / result: ${result}/${realResult} --- ${key}` , realResult != result);
			return realResult;
		}
		else
			return result;
	},

	getRoomMotivationUnits: function (roomName, motivationName , unitName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room === roomName
				&& creep.memory.motive.motivation === motivationName
				&& creep.memory.unit === unitName;
		});
		return result;
	},

	countRoomMotivationNeedCreeps: function (roomName, motivationName , needName)
	{
		let result = this.getRoomMotivationNeedCreeps(roomName, motivationName , needName).length;
		return result;
	},

	getRoomMotivationNeedCreeps: function (roomName, motivationName , needName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room === roomName
				&& creep.memory.motive.motivation === motivationName
				&& creep.memory.motive.need === needName;
		});
		return result;
	},

	countRoomMotivationNeedUnits: function (roomName, motivationName , needName , unitName)
	{
		let result = this.getRoomMotivationNeedUnits(roomName, motivationName , needName , unitName).length;
		return result;
	},

	getRoomMotivationNeedUnits: function (roomName, motivationName , needName , unitName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == motivationName
				&& creep.memory.motive.need == needName
				&& creep.memory.unit == unitName;
		});
		return result;
	},

	countRoomAssignedUnits: function (roomName, unitName)
	{
		let result = this.getRoomAssignedUnits(roomName, unitName).length;
		return result;
	},

	getRoomAssignedUnits: function (roomName, unitName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation != ""
				&& creep.memory.motive.need != ""
				&& creep.memory.unit == unitName;
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
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room == roomName
				&& creep.memory.motive.motivation == ""
				&& creep.memory.motive.need == ""
				&& creep.memory.unit == unitName;
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
	}
};