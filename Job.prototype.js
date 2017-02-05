module.exports = function ()
{
	"use strict";
	let Job = function ()
	{
	};

	/**
	 *
	 * @param creep
	 */
	Job.prototype.getEnergy = function (creep)
	{
		//console.log(`${creep.name} M: ${creep.memory.motive.motivation} N: ${creep.memory.motive.need}`);
		// declarations
		let carry , source , room;
		let numHaulers = Room.countHomeRoomUnits(creep.room.name , "hauler");

		// confirm that creep can attempt this job
		if (creep.carryCapacity === 0)
		{
			creep.deassignMotive();
			creep.sing("NOCARRY!");
			creep.resetSource();
			return;
		}

		// get information
		room = creep.room;

		// if I am full, then reset into work mode ---------------------------------------------------------------------
		if (creep.carrying === creep.carryCapacity)
		{
			creep.say("Full!");
			creep.resetSource();
			creep.memory.job.mode = C.JOB_MODE_WORK;
			return;
		}

		// get some energy ---------------------------------------------------------------------------------------------

		// init sourceId storage
		if (lib.isNull(creep.memory.sourceId) || lib.isNull(creep.memory.sourceType))
		{
			creep.resetSource();
		}

		// validate energy source
		if (creep.memory.sourceId != "")
		{
			source = Game.getObjectById(creep.memory.sourceId);
			if (lib.isNull(source))
			{
				creep.resetSource();
			}
		}

		/**
		 * handle finding energy on the ground
		 * if we are only harvest mode, anyone will get energy off the ground, otherwise just haulers will
		 */

		if (creep.memory.sourceId === "" && (room.energyPickupMode <= C.ROOM_ENERGYPICKUPMODE_CONTAINER || numHaulers === 0))
		{
			this.findEnergyPickup(creep);
		}
		else if (creep.memory.sourceId === "" && creep.memory.unit === "hauler")
		{
			this.findEnergyPickup(creep);
		}

		/**
		 * handle finding energy in link
		 */
		if (room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER && creep.memory.sourceId === "")
		{
			this.findEnergyLink(creep);
		}

		/**
		 * handle finding energy in storage
		 */
		if (room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER && creep.memory.sourceId === "" && creep.memory.motive.motivation != "motivationHaul")
		{
			this.findEnergyStorage(creep);
		}

		/**
		 * handle finding energy on containers
		 */

		// in container mode, everyone looks for energy in containers
		if (room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER && creep.memory.sourceId === "")
		{
			this.findEnergyContainer(creep);
		}

		// otherwise, only haulers get them out
		if (room.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_STORAGE && creep.memory.sourceId === "" && creep.memory.unit === "hauler")
		{
			this.findEnergyContainer(creep);
		}

		/**
		 * handle harvesting energy
		 */

		// harvest my own energy
		if (creep.memory.sourceId === "" && creep.getHasPart(WORK) && room.energyPickupMode <= C.ROOM_ENERGYPICKUPMODE_PRECONTAINER)
		{
			let source = creep.pos.findClosestByPath(Room.getSources(creep.room.name) ,
				{
					maxRooms: 1 ,
					ignoreCreeps: true ,
					filter: function (s)
					{
						let max = 1;
						if (creep.memory.unit != "harvester")
						{
							max = s.maxHarvesters;
						}
						let on = s.creepsOn.length;
						return max > on && s.energy > 0;
					}
				});

			if (!lib.isNull(source))
			{
				creep.memory.sourceId = source.id;
				creep.memory.sourceType = C.JOB_SOURCETYPE_SOURCE;
			}
		}
		//console.log("harvest: " + creep.name + " :" + creep.memory.sourceId);

		// check to see if I can get energy, if so get it, if not, complain
		if (creep.memory.sourceId === "") // I'm screwed, I cannot get energy
		{
			creep.sing("No Energy!");
			if (carry > 0)
			{
				creep.memory.job.mode = C.JOB_MODE_WORK;
				creep.resetSource();
			}
		}
		else
		{ // move to and pick up the goods
			creep.sing("Getting energy!");
			let result;
			switch (creep.memory.sourceType)
			{
				case C.JOB_SOURCETYPE_DROP:
					let drop = Game.getObjectById(creep.memory.sourceId);
					result = creep.pickup(drop);
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.travelTo(drop);
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					break;
				case C.JOB_SOURCETYPE_CONTAINER:
					let container = Game.getObjectById(creep.memory.sourceId);
					result = creep.withdraw(container , RESOURCE_ENERGY);
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.travelTo(container);
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					if (container.store[RESOURCE_ENERGY] < 20)
					{
						creep.say("Empty!");
						creep.memory.job.mode = C.JOB_MODE_WORK;
						creep.resetSource();
					}
					break;
				case C.JOB_SOURCETYPE_SOURCE:

					let source = Game.getObjectById(creep.memory.sourceId);
					result = creep.harvest(source);
					//console.log("harvest: " + creep.name + " :" + result);

					if (result === ERR_NOT_ENOUGH_ENERGY)
					{
						creep.resetSource();
					}
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.travelTo(source);
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while harvesting: " + moveResult);
					}
					break;
				case C.JOB_SOURCETYPE_LINK:
					let link = Game.getObjectById(creep.memory.sourceId);
					result = creep.withdraw(link , RESOURCE_ENERGY);
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.travelTo(link);
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					if (link.energy < 20)
					{
						creep.say("Empty!");
						creep.memory.job.mode = C.JOB_MODE_WORK;
						creep.resetSource();
					}
					break;
			}
		}
	};

	/**
	 *
	 * @param creep
	 */
	Job.prototype.findEnergyPickup = function (creep)
	{
		// look for energy laying on the ground
		let droppedEnergy = Room.getDropped(creep.room.name);

		if (creep.room.memory.threat.level < C.THREAT_NPC)
		{
			let found = false;
			droppedEnergy.forEach(function (drop)
			{
				//console.log("dropID: " + drop);
				if (!found && creep.memory.sourceType != C.JOB_SOURCETYPE_DROP && drop.creepsOn.length === 0)
				{
					//console.log("I'll get it! dropID: " + drop.id);
					creep.memory.sourceId = drop;
					creep.memory.sourceType = C.JOB_SOURCETYPE_DROP;
					found = true;
				}
			} , this);
		}
	};

	Job.prototype.findEnergyStorage = function (creep)
	{
		// look for energy in storages
		let storage = Room.getStructuresType(creep.room.name , STRUCTURE_STORAGE)[0];
		if (!lib.isNull(storage) && storage.store[RESOURCE_ENERGY] > 0)
		{
			creep.memory.sourceId = storage.id;
			creep.memory.sourceType = C.JOB_SOURCETYPE_CONTAINER;
		}
	};

	Job.prototype.findEnergyLink = function (creep)
	{
		let linkId = lib.nullProtect(creep.room.memory.storageLinkId , "");
		let link = Game.getObjectById(linkId);
		if (!lib.isNull(link) && link.energy > 0)
		{
			creep.memory.sourceId = linkId;
			creep.memory.sourceType = C.JOB_SOURCETYPE_LINK;
		}
	};

	Job.prototype.findEnergyContainer = function (creep)
	{
		let containers = Room.getStructuresType(creep.room.name , STRUCTURE_CONTAINER);
		let container = _.max(containers , `store[${RESOURCE_ENERGY}]`);

		//console.log(`room: ${creep.room.name} creep: ${creep.name} container: ${JSON.stringify(container)}/${container}`);

		// second pass check and assign
		if (!lib.isNull(container) && container.store[RESOURCE_ENERGY] > 0)
		{
			creep.memory.sourceId = container.id;
			creep.memory.sourceType = C.JOB_SOURCETYPE_CONTAINER;
		}
	};

	return Job;
};