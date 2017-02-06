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

module.exports = new NeedSupplyExtenders();
