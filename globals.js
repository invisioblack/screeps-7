"use strict";
//const profiler = require('screeps-profiler');

global.cacheManager = require("cacheManager");
//profiler.registerClass(cacheManager , 'cacheManager');
global.cpuManager = require("cpuManager");
//profiler.registerClass(cpuManager , 'cpuManager');
global.diplomacyManager = require("diplomacyManager");
//profiler.registerClass(diplomacyManager , 'diplomacyManager');
global.lib = require("lib");
//profiler.registerClass(lib , 'lib');
global.motivator = require("motivator");
//profiler.registerClass(motivator , 'motivator');


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