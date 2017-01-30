//-------------------------------------------------------------------------
// needHaulToStorage
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
let NeedHaulToStorage = function ()
{
	Need.call(this);
	this.name = "needHaulToStorage";
};

NeedHaulToStorage.prototype = Object.create(Need.prototype);
NeedHaulToStorage.prototype.constructor = NeedHaulToStorage;

NeedHaulToStorage.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};
	this.getUnitHaulToStorageDemand(roomName , "hauler" , memory.demands);

	return memory.demands;
};

module.exports = new NeedHaulToStorage();