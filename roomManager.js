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

			let numWorkers = _.has(global, "cache.rooms." + roomName + ".units.worker") ? global.cache.rooms[roomName].units["worker"].length : 0;

			Memory.rooms[roomName].longDistanceHarvestTargets.forEach( function (roomName)
			{
				let room = Game.rooms[roomName];
				if (lib.isNull(room))
				{
					sortList[roomName] = {};
					sortList[roomName].units = numWorkers;
					sortList[roomName].maxUnits = 1;
					sortList[roomName].room = roomName;

				} else
				{
					sortList[roomName] = {};
					sortList[roomName].units = numWorkers;
					sortList[roomName].maxUnits = room.getMaxHarvesters();
					sortList[roomName].room = roomName;
				}

				sortList[roomName].availUnits = sortList[roomName].maxUnits - sortList[roomName].units;
			}, this);

			//console.log("sortList: " + JSON.stringify(sortList));

			result = _.max(sortList, r => r.availUnits);

			//console.log("result: " + JSON.stringify(result));

			if (result.room === "" || result.availUnits === 0)
				return "";
			else
				return result.room;
		}
	};