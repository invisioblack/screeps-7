"use strict";
const profiler = require('screeps-profiler');

global.cacheManager = require("cacheManager");
profiler.registerClass(cacheManager , 'cacheManager');
global.cpuManager = require("cpuManager");
profiler.registerClass(cpuManager , 'cpuManager');
global.creepManager = require("creepManager");
profiler.registerClass(creepManager , 'creepManager');
global.diplomacyManager = require("diplomacyManager");
profiler.registerClass(diplomacyManager , 'diplomacyManager');
global.lib = require("lib");
profiler.registerClass(lib , 'lib');
global.jobBuild = require("jobBuild");
profiler.registerClass(jobBuild , 'jobBuild');
global.jobClaim = require("jobClaim");
profiler.registerClass(jobClaim , 'jobClaim');
global.jobGuard = require("jobGuard");
profiler.registerClass(jobGuard , 'jobGuard');
global.jobHarvestMinerals = require("jobHarvestMinerals");
profiler.registerClass(jobHarvestMinerals , 'jobHarvestMinerals');
global.jobHarvestSource = require("jobHarvestSource");
profiler.registerClass(jobHarvestSource , 'jobHarvestSource');
global.jobHaulMinerals = require("jobHaulMinerals");
profiler.registerClass(jobHaulMinerals , 'jobHaulMinerals');
global.jobHeal = require("jobHeal");
profiler.registerClass(jobHeal , 'jobHeal');
global.jobLongDistanceHarvest = require("jobLongDistanceHarvest");
profiler.registerClass(jobLongDistanceHarvest , 'jobLongDistanceHarvest');
global.jobLongDistancePickup = require("jobLongDistancePickup");
profiler.registerClass(jobLongDistancePickup , 'jobLongDistancePickup');
global.jobManualTactical = require("jobManualTactical");
profiler.registerClass(jobManualTactical , 'jobManualTactical');
global.jobRangedGuard = require("jobRangedGuard");
profiler.registerClass(jobRangedGuard , 'jobRangedGuard');
global.jobRepair = require("jobRepair");
profiler.registerClass(jobRepair , 'jobRepair');
global.jobSupplyExtenders = require("jobSupplyExtenders");
profiler.registerClass(jobSupplyExtenders , 'jobSupplyExtenders');
global.jobTransfer = require("jobTransfer");
profiler.registerClass(jobTransfer , 'jobTransfer');
global.motivator = require("motivator");
profiler.registerClass(motivator , 'motivator');
global.motivationClaimRoom = require("motivationClaimRoom");
profiler.registerClass(motivationClaimRoom , 'motivationClaimRoom');
global.motivationGarrison = require("motivationGarrison");
profiler.registerClass(motivationGarrison , 'motivationGarrison');
global.motivationHarvestMinerals = require("motivationHarvestMinerals");
profiler.registerClass(motivationHarvestMinerals , 'motivationHarvestMinerals');
global.motivationHarvestSource = require("motivationHarvestSource");
profiler.registerClass(motivationHarvestSource , 'motivationHarvestSource');
global.motivationHaulMinerals = require("motivationHaulMinerals");
profiler.registerClass(motivationHaulMinerals , 'motivationHaulMinerals');
global.motivationHaulToStorage = require("motivationHaulToStorage");
profiler.registerClass(motivationHaulToStorage , 'motivationHaulToStorage');
global.motivationLongDistanceHarvest = require("motivationLongDistanceHarvest");
profiler.registerClass(motivationLongDistanceHarvest , 'motivationLongDistanceHarvest');
global.motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
profiler.registerClass(motivationMaintainInfrastructure , 'motivationMaintainInfrastructure');
global.motivationManualTactical = require("motivationManualTactical");
profiler.registerClass(motivationManualTactical , 'motivationManualTactical');
global.motivationSupplyController = require('motivationSupplyController');
profiler.registerClass(motivationSupplyController , 'motivationSupplyController');
global.motivationSupplySpawn = require('motivationSupplySpawn');
profiler.registerClass(motivationSupplySpawn , 'motivationSupplySpawn');
global.motivationSupplyTower = require("motivationSupplyTower");
profiler.registerClass(motivationSupplyTower , 'motivationSupplyTower');
global.needManager = require("needManager");
profiler.registerClass(needManager , 'needManager');
global.needBuild = require("needBuild");
profiler.registerClass(needBuild , 'needBuild');
global.needClaim = require("needClaim");
profiler.registerClass(needClaim , 'needClaim');
global.needGarrison = require("needGarrison");
profiler.registerClass(needGarrison , 'needGarrison');
global.needHarvestMinerals = require("needHarvestMinerals");
profiler.registerClass(needHarvestMinerals , 'needHarvestMinerals');
global.needHarvestSource = require("needHarvestSource");
profiler.registerClass(needHarvestSource , 'needHarvestSource');
global.needHaulMinerals = require("needHaulMinerals");
profiler.registerClass(needHaulMinerals , 'needHaulMinerals');
global.needHaulToStorage = require("needHaulToStorage");
profiler.registerClass(needHaulToStorage , 'needHaulToStorage');
global.needLongDistanceHarvest = require("needLongDistanceHarvest");
profiler.registerClass(needLongDistanceHarvest , 'needLongDistanceHarvest');
global.needLongDistancePickup = require("needLongDistancePickup");
profiler.registerClass(needLongDistancePickup , 'needLongDistancePickup');
global.needManualTactical = require("needManualTactical");
profiler.registerClass(needManualTactical , 'needManualTactical');
global.needRepair = require("needRepair");
profiler.registerClass(needRepair , 'needRepair');
global.needSupplyExtenders = require("needSupplyExtenders");
profiler.registerClass(needSupplyExtenders , 'needSupplyExtenders');
global.needTransferEnergy = require("needTransferEnergy");
profiler.registerClass(needTransferEnergy , 'needTransferEnergy');
global.roomManager = require("roomManager");
profiler.registerClass(roomManager , 'roomManager');

// settings
global.config = require("config");
global.units = require("units");

// constants
global.C = require("C");
global.RAMPART_UPKEEP = RAMPART_DECAY_AMOUNT / REPAIR_POWER / RAMPART_DECAY_TIME;
global.ROAD_UPKEEP = ROAD_DECAY_AMOUNT / REPAIR_POWER / ROAD_DECAY_TIME;
global.CONTAINER_UPKEEP = CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME_OWNED;
global.REMOTE_CONTAINER_UPKEEP = CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME;
global.STRUCTURE_ALL_NOWALL = "allNoWall";
global.STRUCTURE_ALL_WALL = "allWall";

global.STRUCTURES = [STRUCTURE_SPAWN , STRUCTURE_EXTENSION , STRUCTURE_ROAD , STRUCTURE_WALL , STRUCTURE_RAMPART , STRUCTURE_KEEPER_LAIR , STRUCTURE_PORTAL ,
	STRUCTURE_CONTROLLER , STRUCTURE_LINK , STRUCTURE_STORAGE , STRUCTURE_TOWER , STRUCTURE_OBSERVER , STRUCTURE_POWER_BANK , STRUCTURE_POWER_SPAWN , STRUCTURE_EXTRACTOR ,
	STRUCTURE_LAB , STRUCTURE_TERMINAL , STRUCTURE_CONTAINER , STRUCTURE_NUKER];

// lodash add _.count : by Vaejor -----
_.mixin(
	{
		'count': (collection , predicate = _.identity , value = undefined) =>
		{
			if (_.isString(predicate))
			{
				if (value !== undefined)
				{
					predicate = _.matchesProperty(predicate , value);
				}
				else
				{
					predicate = _.property(predicate);
				}
			}
			else if (_.isObject(predicate) && !_.isFunction(predicate))
			{
				predicate = _.matches(predicate);
			}
			return _.sum(collection , (v , k) => predicate(v , k) ? 1 : 0);
		}
	}
);