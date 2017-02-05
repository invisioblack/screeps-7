"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedSupplyTowers = function ()
{
	Need.call(this);
	this.name = "needSupplyTowers";
};

NeedSupplyTowers.prototype = Object.create(Need.prototype);
NeedSupplyTowers.prototype.constructor = NeedSupplyTowers;

NeedSupplyTowers.prototype.getUnitDemands = function (roomName , memory , motivationName)
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

module.exports = new NeedSupplyTowers();
