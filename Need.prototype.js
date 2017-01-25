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
		if (lib.isNull(Memory.rooms[roomName]) || !_.has(Memory.rooms[roomName], `cache.structures[${STRUCTURE_CONTAINER}]`))
			return {};

		let unit = lib.nullProtect(creepManager.getRoomUnits(roomName, unitName)[0], {});
		let unitCapacity = lib.nullProtect(unit.carryCapacity, 500);
		let containers = _.map(Memory.rooms[roomName].cache.structures[STRUCTURE_CONTAINER], function (cid) {
			let result = Game.getObjectById(cid);
			if (lib.isNull(result))
			{
				result = {};
				result.store = [];
				result.store[RESOURCE_ENERGY] = 0;
			}
			return result;
		});
		let linkId = Memory.rooms[roomName].storageLinkId;
		let link;
		let containerEnergy = _.sum(containers, function (c) {
			return c.store[RESOURCE_ENERGY];
		});
		let preResult = 0;
		if (!lib.isNull(linkId))
		{
			link = Game.getObjectById(linkId);
			containerEnergy += link.energy;
		}

		preResult = containerEnergy / unitCapacity;

		preResult = Math.ceil(preResult);

		//console.log(`Room: ${roomName} containerEnergy: ${containerEnergy} preResult: ${preResult}`);

		result[unitName] = preResult;
	};

	return Need;
};