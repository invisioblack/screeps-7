"use strict";

let Need = require('Need.prototype')();

/**
 *
 * @constructor
 */
let NeedSupplyController = function ()
{
	Need.call(this);
	this.name = "needSupplyController";
};

NeedSupplyController.prototype = Object.create(Need.prototype);
NeedSupplyController.prototype.constructor = NeedSupplyController;

NeedSupplyController.prototype.getUnitDemands = function (roomName , memory , motivationName)
{
	// TODO: this should scale to help maintain energy levels
	memory.demands = {};
	memory.demands["worker"] = 4;

	this.fillUnitDemands(memory.demands);

	return memory.demands;
};

module.exports = new NeedSupplyController();
