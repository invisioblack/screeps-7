"use strict";
const profiler = require('screeps-profiler');

global.cacheManager = require("cacheManager");
profiler.registerClass(cacheManager , 'cacheManager');
global.cpuManager = require("cpuManager");
profiler.registerClass(cpuManager , 'cpuManager');
global.diplomacyManager = require("diplomacyManager");
profiler.registerClass(diplomacyManager , 'diplomacyManager');
global.lib = require("lib");
profiler.registerClass(lib , 'lib');
global.motivator = require("motivator");
profiler.registerClass(motivator , 'motivator');

// motivations
global.motivationHarvest = require("motivationHarvest");
profiler.registerClass(motivationHarvest , 'motivationHarvest');
global.motivationHaul = require("motivationHaul");
profiler.registerClass(motivationHaul , 'motivationHaul');
global.motivationMaintain = require("motivationMaintain");
profiler.registerClass(motivationMaintain , 'motivationMaintain');
global.motivationScout = require("motivationScout");
profiler.registerClass(motivationScout , 'motivationScout');
global.motivationSupply = require("motivationSupply");
profiler.registerClass(motivationSupply , 'motivationSupply');

// Needs
global.needBuild = require("needBuild");
profiler.registerClass(needBuild , 'needBuild');
global.needHarvestSource = require("needHarvestSource");
profiler.registerClass(needHarvestSource , 'needHarvestSource');
global.needHarvestMinerals = require("needHarvestMinerals");
profiler.registerClass(needHarvestMinerals , 'needHarvestMinerals');
global.needHaul = require("needHaul");
profiler.registerClass(needHaul , 'needHaul');
global.needRHaul = require("needRHaul");
profiler.registerClass(needHaul , 'needRHaul');
global.needRMaintain = require("needRMaintain");
profiler.registerClass(needRMaintain , 'needRMaintain');
global.needRepair = require("needRepair");
profiler.registerClass(needRepair , 'needRepair');
global.needRHarvest = require("needRHarvest");
profiler.registerClass(needRHarvest , 'needRHarvest');
global.needSupplyController = require("needSupplyController");
profiler.registerClass(needSupplyController , 'needSupplyController');
global.needSupplyExtenders = require("needSupplyExtenders");
profiler.registerClass(needSupplyExtenders , 'needSupplyExtenders');
global.needScout = require("needScout");
profiler.registerClass(needScout , 'needScout');
global.needSupplySpawn = require("needSupplySpawn");
profiler.registerClass(needSupplySpawn , 'needSupplySpawn');
global.needSupplyTowers = require("needSupplyTowers");
profiler.registerClass(needSupplySpawn , 'needSupplyTowers');

// Jobs
global.jobBuild = require("jobBuild");
profiler.registerClass(jobBuild , 'jobBuild');
global.jobHarvestSource = require("jobHarvestSource");
profiler.registerClass(jobHarvestSource , 'jobHarvestSource');
global.jobHarvestMinerals = require("jobHarvestMinerals");
profiler.registerClass(jobHarvestMinerals , 'jobHarvestMinerals');
global.jobHaul = require("jobHaul");
profiler.registerClass(jobHaul , 'jobHaul');
global.jobRemote = require("jobRemote");
profiler.registerClass(jobRemote , 'jobRemote');
global.jobRepair = require("jobRepair");
profiler.registerClass(jobRepair , 'jobRepair');
global.jobScout = require("jobScout");
profiler.registerClass(jobScout , 'jobScout');
global.jobSupplyExtenders = require("jobSupplyExtenders");
profiler.registerClass(jobSupplyExtenders , 'jobSupplyExtenders');
global.jobTransferEnergy = require("jobTransferEnergy");
profiler.registerClass(jobTransferEnergy , 'jobTransferEnergy');

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

// anon functions
global.af = {};
global.af.goid = id => Game.getObjectById( id );
global.af.ogoid = o => Game.getObjectById( o.id );

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