//------------------------------------------------------------------------------
// roomManager
//------------------------------------------------------------------------------

module.exports =
	{
		//--------------------------------------------------------------------------
		// Declarations
		//--------------------------------------------------------------------------

		//--------------------------------------------------------------------------
		// top level functions
		//--------------------------------------------------------------------------
		"getLongDistanceHarvestTarget": function ()
		{
			let sortList = {};
			let result;

			Memory.longDistanceHarvestTargets.forEach( function (roomName)
			{
				let room = Game.rooms[roomName];
				if (lib.isNull(room))
				{
					sortList[roomName] = {};
					sortList[roomName].units = 0;
					sortList[roomName].maxUnits = 1;
					sortList[roomName].room = roomName;

				} else
				{
					sortList[roomName] = {};
					sortList[roomName].units = strategyManager.countRoomUnits(roomName, "worker");
					sortList[roomName].maxUnits = room.getMaxHarvesters();
					sortList[roomName].room = roomName;
				}

				sortList[roomName].availUnits = sortList[roomName].maxUnits - sortList[roomName].units;
			}, this);

			result = _.max(sortList, r => r.availUnits);

			if (result.room === "")
				return "";
			else
				return result.room;
		}
	};