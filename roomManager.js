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
		getLongDistanceHarvestTarget: function (roomName)
		{
			let sortList = {};
			let result;

			if (lib.isNull(Memory.rooms[roomName]) || lib.isNull(Memory.rooms[roomName].longDistanceHarvestTargets))
				return "";

			Memory.rooms[roomName].longDistanceHarvestTargets.forEach( function (targetRoomName)
			{
				let room = Game.rooms[targetRoomName];
				let numWorkers = creepManager.countRoomUnits(targetRoomName, "worker");
					//_.has(global, "cache.rooms." + targetRoomName + ".units.worker") ? global.cache.rooms[targetRoomName].units["worker"].length : 0;
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
		},

		updateUnitCache: function (roomName)
		{
			let roomCreeps = creepManager.getRoomCreeps(roomName);
			global.cache.rooms[roomName] = {};
			global.cache.rooms[roomName].creeps = roomCreeps;
			global.cache.rooms[roomName].units = _.groupBy(roomCreeps, (o) => {
				return o.memory.unit;
			} );

			_.forEach(units, (v, k)=> {
				if (lib.isNull(global.cache.rooms[roomName].units[k]))
				{
					global.cache.rooms[roomName].units[k] = [];
				}
			});

			roomCreeps = _.filter(Game.creeps, (c) => c.memory.homeRoom === roomName);
			if (lib.isNull(global.cache.homeRooms))
				global.cache.homeRooms = {};
			global.cache.homeRooms[roomName] = {};
			global.cache.homeRooms[roomName].creeps = roomCreeps;
			global.cache.homeRooms[roomName].units = _.groupBy(roomCreeps, (o) => {
				return o.memory.unit;
			} );

			_.forEach(units, (v, k)=> {
				if (lib.isNull(global.cache.homeRooms[roomName].units[k]))
				{
					global.cache.homeRooms[roomName].units[k] = [];
				}
			});

/*
			 let output = "";
			 _.forEach(global.cache.homeRooms, (v, k) => {
			 output += `\nRoom: ${k}`;
			 output += `\n\tCreeps: ${JSON.stringify(v)}`;
			 _.forEach(v.units, (sv, sk) => {
			 output += `\n\tUnit: ${sk}: ${sv}`;
			 });
			 });
			 console.log(output);
*/
		},

		getStructureIds: function (roomName, structureType)
		{
			let result = _.has(Memory, "rooms[" + roomName + "].cache.structures[" + structureType + "]") ? Memory.rooms[roomName].cache.structures[structureType] : [];
			return result;
		},

		getIsLongDistanceHarvestTarget: function (roomName)
		{
			return lib.nullProtect(Memory.rooms[roomName].longDistanceHarvestParents, []).length > 0;
		},

		getIsMine: function (roomName)
		{
			let result = false;
			let room = Game.rooms[roomName];
			if (!lib.isNull(room))
				result = room.getIsMine();
			return result;
		}

	};