"use strict";
global.C = require("C");
global.cacheManager = require("cacheManager");
global.cpuManager = require("cpuManager");
global.lib = require("lib");
global.jobBuild = require("jobBuild");
global.jobClaim = require("jobClaim");
global.jobGuard = require("jobGuard");
global.jobHarvestSource = require("jobHarvestSource");
global.jobHeal = require("jobHeal");
global.jobLongDistanceHarvest = require("jobLongDistanceHarvest");
global.jobManualTactical = require("jobManualTactical");
global.jobRangedGuard = require("jobRangedGuard");
global.jobRepair = require("jobRepair");
global.jobSupplyExtenders = require("jobSupplyExtenders");
global.jobTransfer = require("jobTransfer");
global.motivator = require("motivator");
global.motivationClaimRoom = require("motivationClaimRoom");
global.motivationGarrison = require("motivationGarrison");
global.motivationHarvestSource = require("motivationHarvestSource");
global.motivationHaulToStorage = require("motivationHaulToStorage");
global.motivationLongDistanceHarvest = require("motivationLongDistanceHarvest");
global.motivationMaintainInfrastructure = require('motivationMaintainInfrastructure');
global.motivationManualTactical = require("motivationManualTactical");
global.motivationSupplyController = require('motivationSupplyController');
global.motivationSupplySpawn = require('motivationSupplySpawn');
global.motivationSupplyTower = require("motivationSupplyTower");
global.needManager = require("needManager");
global.needBuild = require("needBuild");
global.needClaim = require("needClaim");
global.needGarrison = require("needGarrison");
global.needHarvestSource = require("needHarvestSource");
global.needHaulToStorage = require("needHaulToStorage");
global.needLongDistanceHarvest = require("needLongDistanceHarvest");
global.needManualTactical = require("needManualTactical");
global.needRepair = require("needRepair");
global.needSupplyExtenders = require("needSupplyExtenders");
global.needTransferEnergy = require("needTransferEnergy");
global.roomManager = require("roomManager");
global.strategyManager = require("strategyManager");
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
