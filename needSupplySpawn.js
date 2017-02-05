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
	let numWorkers = Room.countHomeRoomUnits(roomName, "worker");
	memory.demands = {};

	if (Game.rooms[roomName].controllerLevel < 3 || config.unit.max.worker < numWorkers)
		memory.demands["worker"] = 1;
	else
		memory.demands["hauler"] = 1;

	//console.log(`${Game.rooms[roomName].controllerLevel} ${config.unit.max.worker} <  ${numWorkers} : ${ex(memory.demands)}`);
	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedSupplySpawn();
