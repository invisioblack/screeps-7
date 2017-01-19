//-------------------------------------------------------------------------
// prototype.job
//-------------------------------------------------------------------------
module.exports = function()
{
	"use strict";
	let Job = function () {};

	Job.prototype.JOB_MODE_GETENERGY = 0;
	Job.prototype.JOB_MODE_WORK = 1;

	Job.prototype.JOB_SOURCETYPE_NOTHING = 0;
	Job.prototype.JOB_SOURCETYPE_DROP = 1;
	Job.prototype.JOB_SOURCETYPE_CONTAINER = 2;
	Job.prototype.JOB_SOURCETYPE_SOURCE = 3;
	Job.prototype.JOB_SOURCETYPE_LINK = 4;

	Job.prototype.getEnergy = function (creep)
	{
		//console.log(`${creep.name} M: ${creep.memory.motive.motivation} N: ${creep.memory.motive.need}`);
		// declarations
		let carry, source, room;
		let numHaulers = _.has(global, "cache.homeRooms." + creep.room.name + ".units.hauler") ? global.cache.homeRooms[creep.room.name].units["hauler"].length : 0;

		// confirm that creep can attempt this job
		if (creep.carryCapacity === 0)
		{
			creep.deassignMotive();
			creep.sing("NOCARRY!");
			delete creep.memory.sourceId;
			delete creep.memory.sourceType;

			return;
		}

		// get information
		carry = _.sum(creep.carry);
		room = creep.room;


		// if I am full, then reset into work mode ---------------------------------------------------------------------
		if (carry === creep.carryCapacity)
		{
			creep.say("Full!");
			this.resetSource(creep);
			creep.memory.job.mode = this.JOB_MODE_WORK;
			return;
		}

		// get some energy ---------------------------------------------------------------------------------------------

		// init sourceId storage
		if (lib.isNull(creep.memory.sourceId) || lib.isNull(creep.memory.sourceType))
		{
			this.resetSource(creep);
		}

		// validate energy source
		if (creep.memory.sourceId != "")
		{
			source = Game.getObjectById(creep.memory.sourceId);
			if (lib.isNull(source))
			{
				this.resetSource(creep);
			}
		}

		/**
		 * handle finding energy on the ground
		 * if we are only harvest mode, anyone will get energy off the ground, otherwise just haulers will
 		 */

		if (room.memory.energyPickupMode <= C.ROOM_ENERGYPICKUPMODE_CONTAINER || numHaulers === 0)
		{
			this.findEnergyPickup(creep);
		} else if (creep.memory.motive.motivation === "motivationHaulToStorage")
		{
			this.findEnergyPickup(creep);
		}

		/**
		 * handle finding energy in link
		 */
		if (room.memory.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_STORAGE && creep.memory.sourceId === "")
		{
			this.findEnergyLink(creep);
		}

		/**
		 * handle finding energy in storage
		 */
		if (room.memory.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_STORAGE && creep.memory.sourceId === "" && creep.memory.motive.motivation != "motivationHaulToStorage")
		{
			this.findEnergyStorage(creep);
		}

		/**
		 * handle finding energy on containers
		 */

		// in container mode, everyone looks for energy in containers
		if (room.memory.energyPickupMode === C.ROOM_ENERGYPICKUPMODE_CONTAINER && creep.memory.sourceId === "")
		{
			this.findEnergyContainer(creep);
		}

		// otherwise, only haulers get them out
		if (room.memory.energyPickupMode >= C.ROOM_ENERGYPICKUPMODE_STORAGE && creep.memory.sourceId === "" && creep.memory.unit === "hauler")
		{
			this.findEnergyContainer(creep);
		}

		/**
		 * handle harvesting energy
		 */

		// harvest my own energy
		if (creep.memory.sourceId === "" && creep.getHasPart(WORK) && room.memory.energyPickupMode === C.ROOM_ENERGYPICKUPMODE_HARVEST)
		{
			let source = creep.pos.findClosestByPath(FIND_SOURCES,
				{
					maxRooms: 1,
					ignoreCreeps: true,
					filter: function (s)
					{
						let max = 1;
						if (creep.memory.unit != "harvester")
							max = s.getMaxHarvesters();
						let on = creepManager.countCreepsOnSource(s.id);
						return max > on && s.energy > 0;
					}
				});

			if (!lib.isNull(source))
			{
				creep.memory.sourceId = source.id;
				creep.memory.sourceType = this.JOB_SOURCETYPE_SOURCE;
			}
		}
		//console.log("harvest: " + creep.name + " :" + creep.memory.sourceId);

		// check to see if I can get energy, if so get it, if not, complain
		if (creep.memory.sourceId === "") // I'm screwed, I cannot get energy
		{
			creep.sing("No Energy!");
			if (creep.room.name != creep.memory.homeRoom)
			{
				creep.deassignMotive(creep.memory.homeRoom);
				this.resetSource(creep);
			}

			if (carry > 0)
			{
				creep.memory.job.mode = this.JOB_MODE_WORK;
				this.resetSource(creep);
			}
		} else { // move to and pick up the goods
			creep.sing("Getting energy!");
			let result;
			switch (creep.memory.sourceType)
			{
				case this.JOB_SOURCETYPE_DROP:
					let drop = Game.getObjectById(creep.memory.sourceId);
					result = creep.pickup(drop);
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.moveTo(drop, {"maxRooms": 1});
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					break;
				case this.JOB_SOURCETYPE_CONTAINER:
					let container = Game.getObjectById(creep.memory.sourceId);
					result = creep.withdraw(container, RESOURCE_ENERGY);
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.moveTo(container, {"maxRooms": 1});
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					if (container.store[RESOURCE_ENERGY] < 20)
					{
						creep.say("Empty!");
						creep.memory.job.mode = this.JOB_MODE_WORK;
						this.resetSource(creep);
					}
					break;
				case this.JOB_SOURCETYPE_SOURCE:

					let source = Game.getObjectById(creep.memory.sourceId);
					result = creep.harvest(source);
					//console.log("harvest: " + creep.name + " :" + result);

					if (result === ERR_NOT_ENOUGH_ENERGY)
					{
						this.resetSource(creep);
					}
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.moveTo(source, {"maxRooms": 1});
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while harvesting: " + moveResult);
					}
					break;
				case this.JOB_SOURCETYPE_LINK:
					let link = Game.getObjectById(creep.memory.sourceId);
					result = creep.withdraw(link, RESOURCE_ENERGY);
					if (result === ERR_NOT_IN_RANGE)
					{
						let moveResult = creep.moveTo(link, {"maxRooms": 1});
						//if (moveResult < 0 && moveResult != ERR_TIRED)
						//	console.log(creep.name + " Can't move while getting from container: " + moveResult);
					}
					if (link.energy < 20)
					{
						creep.say("Empty!");
						creep.memory.job.mode = this.JOB_MODE_WORK;
						this.resetSource(creep);
					}
					break;
			}
		}
	};

	Job.prototype.countCreepsOnSource = function (sourceId)
	{
		let result = 0;

		for (let creepName in Game.creeps)
		{
			let creep = Game.creeps[creepName];
			if (!lib.isNull(creep.memory.sourceId))
			{
				if (creep.memory.sourceId === sourceId)
					result++;
			}
		}

		return result;
	};

	Job.prototype.resetSource = function (creep)
	{
		creep.memory.sourceId = "";
		creep.memory.sourceType = this.JOB_SOURCETYPE_NOTHING;
	};

	Job.prototype.findEnergyPickup = function (creep)
	{
		// look for energy laying on the ground
		let droppedEnergy = creep.room.memory.cache.dropped;

		if (creep.room.memory.threat.level < C.THREAT_NPC) {
			droppedEnergy.forEach(function (drop) {
				//console.log("dropID: " + drop);
				if (creep.memory.sourceType != this.JOB_SOURCETYPE_DROP && creepManager.countCreepsOnSource(drop) === 0) {
					//console.log("I'll get it! dropID: " + drop.id);
					creep.memory.sourceId = drop;
					creep.memory.sourceType = this.JOB_SOURCETYPE_DROP;
				}
			}, this);
		}
	};

	Job.prototype.findEnergyStorage = function (creep)
	{
		// look for energy in storages
		let storageId = creep.room.memory.cache.structures[STRUCTURE_STORAGE][0];
		let storage = Game.getObjectById(storageId);
		if (!lib.isNull(storage) && storage.store[RESOURCE_ENERGY] > 0)
		{
			creep.memory.sourceId = storageId;
			creep.memory.sourceType = this.JOB_SOURCETYPE_CONTAINER;
		}
	};

	Job.prototype.findEnergyLink = function (creep)
	{
		let linkId = creep.room.memory.storageLinkId;
		let link = Game.getObjectById(linkId);
		if (!lib.isNull(link) && link.energy > 0)
		{
			creep.memory.sourceId = linkId;
			creep.memory.sourceType = this.JOB_SOURCETYPE_LINK;
		}
	};

	Job.prototype.findEnergyContainer = function (creep)
	{
		let containerIds = creep.room.memory.cache.structures[STRUCTURE_CONTAINER];
		let containers = _.map(containerIds, function (c) { return Game.getObjectById(c)});
		let container = _.max(containers, function (o) { return o.store[RESOURCE_ENERGY]});

		//console.log("containers: " + container.store[RESOURCE_ENERGY]);

		// second pass check and assign
		if (!lib.isNull(container) && container.store[RESOURCE_ENERGY] > 0)
		{
			creep.memory.sourceId = container.id;
			creep.memory.sourceType = this.JOB_SOURCETYPE_CONTAINER;
		}
	};


	Job.prototype.findEnergySource = function (creep)
	{
		let sources = _.map(creep.room.cache.sources, function (s) { return Game.getObjectById(s); });

		let source = creep.pos.findClosestByPath(sources,
			{
				maxRooms: 1,
				ignoreCreeps: true,
				filter: function (s)
				{
					let max = 1;
					if (creep.memory.unit != "harvester")
						max = s.getMaxHarvesters();
					let on = creepManager.countCreepsOnSource(s.id);
					return max > on && s.energy > 0;
				}
			});

		if (!lib.isNull(source))
		{
			creep.memory.sourceId = source.id;
			creep.memory.sourceType = this.JOB_SOURCETYPE_SOURCE;
		}
	};

	return Job;
};