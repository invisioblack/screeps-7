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
let NeedHaulMinerals = function ()
{
	Need.call(this);
	this.name = "needHaulMinerals";
};

NeedHaulMinerals.prototype = Object.create(Need.prototype);
NeedHaulMinerals.prototype.constructor = NeedHaulMinerals;

NeedHaulMinerals.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	memory.demands = {};
	memory.demands["hauler"] = 1;

	return memory.demands;
};

module.exports = new NeedHaulMinerals();