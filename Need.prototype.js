//----------------------------------------------------------------------------------------------------------------------
// need
//----------------------------------------------------------------------------------------------------------------------
// memory --------------------------------------------------------------------------------------------------------------
// key: room.memory.motivations[motivationName].needs[needType.sourceId]
// type: string type name
// name: same as key
// unitDemands: {} - key unit, value number
// priority: constant
"use strict";
// probably need specific
// sourceId:
// targetId:
// distance:

//----------------------------------------------------------------------------------------------------------------------
// modules
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// object
//----------------------------------------------------------------------------------------------------------------------
module.exports = function ()
{
	let Need = function () {};

	Need.prototype.name = "Need";

	/**
	 * Returns unit demand for supplying things that need energy
	 * @param roomName
	 * @param target
	 * @param unitName
	 * @param result
	 */
	Need.prototype.getUnitSupplyDemand = function (roomName, target, unitName, result)
	{
		let energy, energyCapacity, neededEnergy;
		let unit = lib.nullProtect(creepManager.getRoomUnits(roomName, unitName)[0], {});
		let unitCapacity = lib.nullProtect(unit.carryCapacity, 50);

		if (lib.isNull(target))
		{
			energyCapacity = 0;
			energy = 0;
		}
		else if (!lib.isNull(target.energy))
		{
			energyCapacity = target.energyCapacity;
			energy = target.energy;
		} else {
			energyCapacity = target.progressTotal;
			energy = target.progress;
		}

		neededEnergy = energyCapacity - energy;
		result[unitName] = Math.ceil(neededEnergy / unitCapacity);
	};

	Need.prototype.getUnitHaulToStorageDemand = function (roomName, unitName, result)
	{
		let unit = lib.nullProtect(creepManager.getRoomUnits(roomName, unitName)[0], {});
		let unitCapacity = lib.nullProtect(unit.carryCapacity, 50);
		let containers = _.map(Memory.rooms[roomName].cache.structures[STRUCTURE_CONTAINER], function (cid) {
			return Game.getObjectById(cid);
		});
		let containerEnergy = _.sum(containers, function (c) {
			return c.store[RESOURCE_ENERGY];
		});
		result[unitName] = Math.ceil(containerEnergy / unitCapacity);
	};

	return Need;
};