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
			var sortList = {};
			var result;

			Memory.longDistanceHarvestTargets.forEach( function (roomName)
			{
				var room = Game.rooms[roomName];
				if (lib.isNull(room))
				{
					sortList[roomName] = {};
					sortList[roomName].units = 0;
					sortList[roomName].room = roomName;

				} else
				{
					sortList[roomName] = {};
					sortList[roomName].units = room.getUnits("worker");
					sortList[roomName].room = roomName;
				}
			}, this);

			result = _.min(sortList, r => r.units);
			return result.room;

		}
	};