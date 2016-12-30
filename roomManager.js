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
			var sortedArray = [];

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
					sortList[roomName].units = room.getMotivationUnits("motivationLongDistanceHarvest" , "worker");
					sortList[roomName].room = roomName;
				}
			}, this);

			sortedArray = _.sortByOrder(sortList, ['units'], ['asc']);

			return sortedArray[0].room;
		}
	};