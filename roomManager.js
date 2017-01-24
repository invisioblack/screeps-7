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
		getLongDistanceHarvestTarget: function (roomName) {
			let sortList = {};
			let result;

			if (lib.isNull(Memory.rooms[roomName]) || lib.isNull(Memory.rooms[roomName].longDistanceHarvestTargets))
				return "";

			Memory.rooms[roomName].longDistanceHarvestTargets.forEach(function (targetRoomName) {
				let room = Game.rooms[targetRoomName];
				let numWorkers = creepManager.countRoomUnits(targetRoomName, "worker");
				//_.has(global, "cache.rooms." + targetRoomName + ".units.worker") ? global.cache.rooms[targetRoomName].units["worker"].length : 0;
				if (lib.isNull(room)) {
					sortList[targetRoomName] = {};
					sortList[targetRoomName].units = numWorkers;
					sortList[targetRoomName].maxUnits = 1;
					sortList[targetRoomName].room = targetRoomName;

				} else {
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

		updateUnitCache: function (roomName) {
			let roomCreeps = creepManager.getRoomCreepsRaw(roomName);
			let homeRoomCreeps = _.filter(Game.creeps, (c) => c.memory.homeRoom === roomName);

			// build room assigned cache
			global.cache.rooms[roomName] = {};
			global.cache.rooms[roomName].creeps = roomCreeps;
			global.cache.rooms[roomName].units = _.groupBy(roomCreeps, (o) => {
				return o.memory.unit;
			});

			_.forEach(units, (v, k) => {
				if (lib.isNull(global.cache.rooms[roomName].units[k])) {
					global.cache.rooms[roomName].units[k] = [];
				}
			});

			// build home room cache
			if (lib.isNull(global.cache.homeRooms))
				global.cache.homeRooms = {};
			global.cache.homeRooms[roomName] = {};
			global.cache.homeRooms[roomName].creeps = homeRoomCreeps;
			global.cache.homeRooms[roomName].units = _.groupBy(homeRoomCreeps, (o) => {
				return o.memory.unit;
			});

			_.forEach(units, (v, k) => {
				if (lib.isNull(global.cache.homeRooms[roomName].units[k])) {
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

		/**
		 * room.memory.cache.unitMotive
		 *  motivations
		 *      units - count
		 *      needs
		 *          units - count
		 * @param roomName
		 */
		updateUnitMotiveCache: function (roomName) {
			// declare
			let debug = false;
			let roomMemory;
			let roomCreeps;

			// validate room memory
			roomMemory = Memory.rooms[roomName];
			if (lib.isNull(roomMemory) || lib.isNull(roomMemory.motivations)) {
				lib.log(`Error: updateUnitMotiveCache(${roomName}): room memory or motivation memory not found.`, debug);
				return;
			}

			// validate cache
			if (lib.isNull(roomMemory.cache))
				roomMemory.cache = {};

			// init unitMotive cache
			roomMemory.cache.unitMotive = {};

			// init each motive memory
			_.forEach(roomMemory.motivations, (motivation, motivationName) => {
				roomMemory.cache.unitMotive[motivationName] = {};
				roomMemory.cache.unitMotive[motivationName].units = {};
				_.forEach(units, (uv, uk) => {
					roomMemory.cache.unitMotive[motivationName].units[uk] = 0;
				});

				// init needs
				roomMemory.cache.unitMotive[motivationName].needs = {};
				_.forEach(motivation.needs, (nv, nk) => {
					roomMemory.cache.unitMotive[motivationName].needs[nk] = {};
					roomMemory.cache.unitMotive[motivationName].needs[nk].units = {};
					_.forEach(units, (uv, uk) => {
						roomMemory.cache.unitMotive[motivationName].needs[nk].units[uk] = 0;
					});
				});
			});

			// update creeps into cache
			roomCreeps = creepManager.getRoomCreepsRaw(roomName);

			_.forEach(roomCreeps, (c, k) => {
				if (c.memory.motive.motivation !== "")
				{
					roomMemory.cache.unitMotive[c.memory.motive.motivation].units[c.memory.unit]++;
					if (lib.isNull(roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need]))
					{
						roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need] = {};
						roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units = {};
						roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units[c.memory.unit] = 0;

					}
					roomMemory.cache.unitMotive[c.memory.motive.motivation].needs[c.memory.motive.need].units[c.memory.unit]++;
				}
			});

			lib.log(`updateUnitMotiveCache(${roomName}): ${JSON.stringify(roomMemory.cache.unitMotive)}`, debug);
		},

		getStructureIds: function (roomName, structureType) {
			let result = _.has(Memory, "rooms[" + roomName + "].cache.structures[" + structureType + "]") ? Memory.rooms[roomName].cache.structures[structureType] : [];
			return result;
		},

		getIsLongDistanceHarvestTarget: function (roomName) {
			return lib.nullProtect(Memory.rooms[roomName].longDistanceHarvestParents, []).length > 0;
		},

		getIsMine: function (roomName) {
			let result = false;
			let room = Game.rooms[roomName];
			if (!lib.isNull(room))
				result = room.getIsMine();
			return result;
		}

	};