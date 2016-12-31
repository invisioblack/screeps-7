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

			console.log("sortList: " + JSON.stringify(sortList));

			result = _.max(sortList, r => r.availUnits);

			console.log("result: " + JSON.stringify(result));

			if (result.room === "" || result.availUnits === 0)
				return "";
			else
				return result.room;
		}
	};