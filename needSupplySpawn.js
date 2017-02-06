"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedSupplySpawn = function ()
{
	Need.call(this);
	this.name = "needSupplySpawn";
};

NeedSupplySpawn.prototype = Object.create(Need.prototype);
NeedSupplySpawn.prototype.constructor = NeedSupplySpawn;

NeedSupplySpawn.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	let room = Game.rooms[roomName];
	let numHauler = Room.countHomeRoomUnits(roomName, "hauler");
	memory.demands = {};

	if (room.energyPickupMode < C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
	{
		memory.demands["worker"] = 1;
	}
	else if (room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER && numHauler === 0)
	{
		memory.demands["worker"] = 1;
		memory.demands["hauler"] = 1;
	}
	else
	{
		memory.demands["hauler"] = 1;
	}

	//console.log(`${Game.rooms[roomName].controllerLevel} ${config.unit.max.worker} <  ${numWorkers} : ${ex(memory.demands)}`);
	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedSupplySpawn();
