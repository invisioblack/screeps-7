//-------------------------------------------------------------------------
// MotivationMaintainInfrastructure
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
var C = require('C');
var needBuild = require("needBuild");
var needRepair = require("needRepair");

// script prototypes
var Motivation = require('prototype.motivation')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
var MotivationMaintainInfrastructure = function ()
{
	Motivation.call(this);
	this.name = "motivationMaintainInfrastructure";
	this.needs = {};
	this.needs["needBuild"] = needBuild;
	this.needs["needRepair"] = needRepair;
};

MotivationMaintainInfrastructure.prototype = Object.create(Motivation.prototype);
MotivationMaintainInfrastructure.prototype.constructor = MotivationMaintainInfrastructure;

MotivationMaintainInfrastructure.prototype.getDemands = function (roomName, resources)
{
	var result = {};

	var constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
	var progress = _.sum(constructionSites, "progress");
	var progressTotal = _.sum(constructionSites, "progressTotal");

	result.energy = progressTotal - progress;
	result.units = this.getUnitDemands(roomName);
	result.spawn = resources.units["worker"].allocated < result.units["worker"];
	console.log('  Maintain Infrastructure Demands: Workers: ' + result.units["worker"] + ' Spawn: ' + result.spawn);
	return result;
};

MotivationMaintainInfrastructure.prototype.updateNeeds = function (roomName)
{
	var room = Game.rooms[roomName];
	var memory = room.memory.motivations[this.name];
	var sortedNeedsByDistance, x;

	// insure memory is initialized for needs
	if (lib.isNull(memory.needs))
	{
		memory.needs = {};
	}

	// Handle Build Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
	constructionSites.forEach(function (cs) {
		if (!lib.isNull(cs))
		{
			var needName = "build." + cs.id;
			var need;

			//console.log('Site: ' + cs.id);

			// create new need if one doesn't exist
			if (lib.isNull(memory.needs[needName]))
			{
				memory.needs[needName] = {};
				need = memory.needs[needName];
				need.type = "needBuild";
				need.name = needName;
				need.sourceId = cs.pos.findClosestByPath(FIND_SOURCES).id; // get energy from closest source
				need.targetId = cs.id;
				need.distance = room.findPath(cs.pos , Game.getObjectById(need.sourceId).pos).length;
				need.priority = C.PRIORITY_5;
			}
			else
			{
				need = memory.needs[needName];
			}
		}
	}, this);

	// Handle Repair Needs -------------------------------------------------------------------------------------
	// look up sources and find out how many needs we should have for each one
	var repairSites = room.find(FIND_STRUCTURES, {
		filter: function (s) {
			return s.hits < s.hitsMax;
		}
	});
	repairSites.forEach(function (rs) {
		var needName = "repair." + rs.id;
		var need;

		//console.log('Source: ' + s.id + ' Available Working Spots: ' + availableHarvesters + "/" + maxHarvesters);

		// create new need if one doesn't exist
		if (lib.isNull(memory.needs[needName]))
		{
			memory.needs[needName] = {};
			need = memory.needs[needName];
			need.type = "needRepair";
			need.name = needName;
			need.sourceId = rs.pos.findClosestByRange(FIND_SOURCES).id; // get energy from closest source
			need.targetId = rs.id;
			need.distance = room.findPath(rs.pos, Game.getObjectById(need.sourceId).pos).length;
			need.priority = C.PRIORITY_1;
		} else {
			need = memory.needs[needName];
		}

	}, this);

	for (var needName in memory.needs)
	{
		if (lib.isNull(memory.needs[needName]))
			delete memory.needs[needName];
		else
		{
			if (lib.isNull(memory.needs[needName].type))
				delete memory.needs[needName];
			// cull build needs
			else if (memory.needs[needName].type == "needBuild")
			{
				if (lib.isNull(memory.needs[needName].targetId))
				{
					console.log("-------------- CULLING INCOMPLETE CONSTRUCTION SITE -------------");
					delete memory.needs[needName];
				}
				else
				{
					var siteId = memory.needs[needName].targetId;
					var result = _.filter(constructionSites , {"id": siteId});

					// if there are no sites, then cull it
					if (result.length == 0)
					{
						console.log("-------------- CULLING CONSTRUCTION SITE -------------");
						delete memory.needs[needName];
					}
				}
			}

			// cull repair needs
			else if (memory.needs[needName].type == "needRepair")
			{
				if (lib.isNull(memory.needs[needName].targetId))
				{
					console.log("-------------- CULLING INCOMPLETE REPAIR SITE -------------");
					delete memory.needs[needName];
				}
				else
				{

					var siteId = memory.needs[needName].targetId;
					var result = _.filter(repairSites , {"id": siteId});

					// if there are no sites, then cull it
					if (result.length == 0)
					{
						console.log("-------------- CULLING REPAIR SITE -------------");
						delete memory.needs[needName];
					}
				}
			}
		}
	}

	// prioritize needs
	for (var needName in memory.needs)
	{
		var need = memory.needs[needName];
		var site = Game.getObjectById(need.targetId);

		switch (site.structureType)
		{
			case STRUCTURE_EXTENSION:
				need.priority = C.PRIORITY_1;
				break;
			default:
				need.priority = C.PRIORITY_2;
				break;
		}

	}
};

MotivationMaintainInfrastructure.prototype.desiredSpawnUnit = function ()
{
	return "worker";
};


module.exports = new MotivationMaintainInfrastructure();