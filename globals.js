const profiler = require('screepsProfiler');

global.C = require("C");
global.cacheManager = require("cacheManager");
profiler.registerObject(cacheManager, 'cacheManager');
global.cpuManager = require("cpuManager");
profiler.registerObject(cpuManager, 'cpuManager');
global.lib = require("lib");
profiler.registerObject(lib, 'lib');
global.jobBuild = require("jobBuild");
profiler.registerObject(jobBuild, 'jobBuild');
global.jobClaim = require("jobClaim");
profiler.registerObject(jobClaim, 'jobClaim');
global.jobGuard = require("jobGuard");
profiler.registerObject(jobGuard, 'jobGuard');
global.jobHarvestSource = require("jobHarvestSource");
profiler.registerObject(jobHarvestSource, 'jobHarvestSource');
global.jobHeal = require("jobHeal");
profiler.registerObject(jobHeal, 'jobHeal');
global.jobLongDistanceHarvest = require("jobLongDistanceHarvest");
profiler.registerObject(jobLongDistanceHarvest, 'jobLongDistanceHarvest');
global.jobManualTactical = require("jobManualTactical");
profiler.registerObject(jobManualTactical, 'jobManualTactical');
global.jobRangedGuard = require("jobRangedGuard");
profiler.registerObject(jobRangedGuard, 'jobRangedGuard');
global.jobRepair = require("jobRepair");
profiler.registerObject(jobRepair, 'jobRepair');
global.jobSupplyExtenders = require("jobSupplyExtenders");
profiler.registerObject(jobSupplyExtenders, 'jobSupplyExtenders');
global.jobTransfer = require("jobTransfer");
profiler.registerObject(jobTransfer, 'jobTransfer');
global.motivator = require("motivator");
profiler.registerObject(motivator, 'motivator');
global.motivationClaimRoom = require("motivationClaimRoom");
profiler.registerObject(motivationClaimRoom, 'motivationClaimRoom');
global.motivationGarrison = require("motivationGarrison");
profiler.registerObject(motivationGarrison, 'motivationGarrison');
global.motivationHarvestSource = require("motivationHarvestSource");
profiler.registerObject(motivationHarvestSource, 'motivationHarvestSource');
global.motivationHaulToStorage = require("motivationHaulToStorage");
profiler.registerObject(motivationHaulToStorage, 'motivationHaulToStorage');
global.motivationLongDistanceHarvest = require("motivationLongDistanceHarvest");
profiler.registerObject(motivationLongDistanceHarvest, 'motivationLongDistanceHarvest');
global.motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
profiler.registerObject(motivationMaintainInfrastructure, 'motivationMaintainInfrastructure');
global.motivationManualTactical = require("motivationManualTactical");
profiler.registerObject(motivationManualTactical, 'motivationManualTactical');
global.motivationSupplyController = require('motivationSupplyController');
profiler.registerObject(motivationSupplyController, 'motivationSupplyController');
global.motivationSupplySpawn = require('motivationSupplySpawn');
profiler.registerObject(motivationSupplySpawn, 'motivationSupplySpawn');
global.motivationSupplyTower = require("motivationSupplyTower");
profiler.registerObject(motivationSupplyTower, 'motivationSupplyTower');
global.needManager = require("needManager");
profiler.registerObject(needManager, 'needManager');
global.needBuild = require("needBuild");
profiler.registerObject(needBuild, 'needBuild');
global.needClaim = require("needClaim");
profiler.registerObject(needClaim, 'needClaim');
global.needGarrison = require("needGarrison");
profiler.registerObject(needGarrison, 'needGarrison');
global.needHarvestSource = require("needHarvestSource");
profiler.registerObject(needHarvestSource, 'needHarvestSource');
global.needHaulToStorage = require("needHaulToStorage");
profiler.registerObject(needHaulToStorage, 'needHaulToStorage');
global.needLongDistanceHarvest = require("needLongDistanceHarvest");
profiler.registerObject(needLongDistanceHarvest, 'needLongDistanceHarvest');
global.needManualTactical = require("needManualTactical");
profiler.registerObject(needManualTactical, 'needManualTactical');
global.needRepair = require("needRepair");
profiler.registerObject(needRepair, 'needRepair');
global.needSupplyExtenders = require("needSupplyExtenders");
profiler.registerObject(needSupplyExtenders, 'needSupplyExtenders');
global.needTransferEnergy = require("needTransferEnergy");
profiler.registerObject(needTransferEnergy, 'needTransferEnergy');
global.roomManager = require("roomManager");
profiler.registerObject(roomManager, 'roomManager');
global.strategyManager = require("strategyManager");
profiler.registerObject(strategyManager, 'strategyManager');
global.units = require("units");

// settings
global.config = require("config");

// constants
global.RAMPART_UPKEEP	        = RAMPART_DECAY_AMOUNT / REPAIR_POWER / RAMPART_DECAY_TIME;
global.ROAD_UPKEEP		        = ROAD_DECAY_AMOUNT / REPAIR_POWER /  ROAD_DECAY_TIME;
global.CONTAINER_UPKEEP         = CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME_OWNED;
global.REMOTE_CONTAINER_UPKEEP  = CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME;


global.STRUCTURES = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL,
	STRUCTURE_CONTROLLER, STRUCTURE_LINK, STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_OBSERVER, STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR,
	STRUCTURE_LAB, STRUCTURE_TERMINAL, STRUCTURE_CONTAINER, STRUCTURE_NUKER];

global.cpuUsed = 0;