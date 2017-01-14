//------------------------------------------------------------------------------
// roomManager
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
		"getLongDistanceHarvestTarget": function (roomName)
		{
			let sortList = {};
			let result;

			if (lib.isNull(Memory.rooms[roomName]) || lib.isNull(Memory.rooms[roomName].longDistanceHarvestTargets))
				return "";



			Memory.rooms[roomName].longDistanceHarvestTargets.forEach( function (targetRoomName)
			{
				let room = Game.rooms[targetRoomName];
				let numWorkers = _.has(global, "cache.rooms." + targetRoomName + ".units.worker") ? global.cache.rooms[targetRoomName].units["worker"].length : 0;
				if (lib.isNull(room))
				{
					sortList[targetRoomName] = {};
					sortList[targetRoomName].units = numWorkers;
					sortList[targetRoomName].maxUnits = 1;
					sortList[targetRoomName].room = targetRoomName;

				} else
				{
					sortList[targetRoomName] = {};
					sortList[targetRoomName].units = numWorkers;
					sortList[targetRoomName].maxUnits = room.getMaxHarvesters();
					sortList[targetRoomName].room = targetRoomName;
				}

				sortList[targetRoomName].availUnits = sortList[targetRoomName].maxUnits - sortList[targetRoomName].units;
			}, this);

			//console.log("sortList: " + JSON.stringify(sortList));

			result = _.max(sortList, r => r.availUnits);

			//console.log("result: " + JSON.stringify(result));

			if (result.room === "" || result.availUnits < 1)
				return "";
			else
				return result.room;
		}
	};