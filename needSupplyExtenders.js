//-------------------------------------------------------------------------
// needSupplyExtenders
//-------------------------------------------------------------------------
"use strict";

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Need = require('Need.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
let NeedSupplyExtenders = function ()
{
	Need.call(this);
	this.name = "needSupplyExtenders";
};

NeedSupplyExtenders.prototype = Object.create(Need.prototype);
NeedSupplyExtenders.prototype.constructor = NeedSupplyExtenders;

NeedSupplyExtenders.prototype.getUnitDemands = function (roomName , memory , motivationName)
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

module.exports = new NeedSupplyExtenders();
