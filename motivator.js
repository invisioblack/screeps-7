//-------------------------------------------------------------------------
// Motivator
// The motivator is responsible for managing the highest level decision 
// making. The motivator is the part in which the player interacts with.
// It makes decisions on how resources many resources are allocated to 
// each active motivation.
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// library modules
var C = require('C');
var lib = require('lib');

// game modules
var motivationSupplySpawn = require('motivationSupplySpawn');
var motivationSupplyController = require('motivationSupplyController');
var resourceManager = require('resourceManager');

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports =
{

	"mode": C.MOTIVATOR_MODE_SINGLE_MINDED,

	//-------------------------------------------------------------------------
	// Main motivator function, should be called first from main
	"motivate": function ()
	{
		// motivate in each room we control
		for (var roomName in Game.rooms)
		{
			var room = Game.rooms[roomName];
			if (room.controller.my)
			{
				//-------------------------------------------------------------
				// motivate
				console.log('motivate ' + roomName);
				
				// determine room resources
				var resources = {};
				resources.spawnEnergy = resourceManager.getRoomSpawnEnergy(roomName);
				resources.units = [];
				resources.units['worker'] = {};
				resources.units['worker'].total = resourceManager.getRoomCreeps(roomName, 'worker');
				console.log('Spawn Energy: ' + resources.spawnEnergy.energy + '/' + resources.spawnEnergy.energyCapacity);
				console.log('Workers: ' + resources.units["worker"].total);

				// get room collector status
				var collectorStatus = resourceManager.getCollectorStatus(roomName);
				console.log('Collector Level: ' + collectorStatus.level + ' ' + collectorStatus.progress + '/' + collectorStatus.progressTotal + ' Downgrade: ' + collectorStatus.ticksToDowngrade);

				// determine motivation demands
				var demands = {};
				demands.motivationSupplySpawn = motivationSupplySpawn.getDemands(roomName, resources);
				demands.motivationSupplyController = motivationSupplyController.getDemands(roomName, resources, collectorStatus);
				console.log('Supply Spawn Demands: e: ' + demands.motivationSupplySpawn.energy + ' Workers: ' + demands.motivationSupplySpawn.workers + ' Spawn: ' + demands.motivationSupplySpawn.spawn);
				console.log('Supply Controller Demands: e: ' + demands.motivationSupplyController.energy + ' Workers: ' + demands.motivationSupplyController.workers + ' Spawn: ' + demands.motivationSupplyController.spawn);


				// handle motivations
				var sortedMotivations = _.sortBy(Memory.rooms[roomName].motivations, ['priority']);

				// decide which motivations should be active
				if (demands.motivationSupplySpawn.energy > 0)
				{
					motivationSupplySpawn.setActive(roomName, true);
				} else {
					motivationSupplySpawn.setActive(roomName, false);
				}

				if (demands.motivationSupplyController.energy > 0)
				{
					motivationSupplyController.setActive(roomName, true);
				} else {
					motivationSupplyController.setActive(roomName, false);
				}

				console.log('Supply Spawn Active: ' + motivationSupplySpawn.getActive(roomName));
				console.log('Supply Controller Active: ' + motivationSupplyController.getActive(roomName));

				// ------------------------------------------------------------				
				// distribute resources to motivations

				// allocate spawn ---------------------------------------------
				var isSpawnAllocated = false;
				sortedMotivations.forEach(function(element) {
					if (!isSpawnAllocated && element.active && demands[element.name].spawn > 0) {
						element.spawnAllocated = true;
						isSpawnAllocated = true;
					} else {
						element.spawnAllocated = false;
					}
				}, this);

				// workers ----------------------------------------------------
				// calculate allocated Workers
				resources.units["worker"].allocated = 0;
				for (var motivationName in Memory.rooms[roomName].motivations)
				{
					var motivation = Memory.rooms[roomName].motivations[motivationName];
					if (!lib.isNull(motivation.allocatedUnits['worker']))
						resources.units["worker"].allocated += motivation.allocatedUnits['worker'];
				}

				// allocate workers
				resources.units["worker"].unallocated = resources.units["worker"].total - resources.units["worker"].allocated;
				console.log('Pre: Worker Allocation: ' + resources.units["worker"].allocated + '/' + resources.units["worker"].total + ' Unallocated: ' + resources.units["worker"].unallocated);

				var x = 1;
				resources.units["worker"].allocated = 0;
				resources.units["worker"].unallocated = resources.units["worker"].total;

				sortedMotivations.forEach(function(element) {
					console.log(element.name);
					if (element.active) {
						// calculate diminishing number of workers on each iteration
						var workersToAllocate = Math.ceil(resources.units["worker"].total / (2 * x));

						// apply workers bounded by number available
						if (workersToAllocate <= resources.units["worker"].unallocated)
							element.allocatedUnits['worker'] = workersToAllocate;
						else
							element.allocatedUnits['worker'] = resources.units["worker"].unallocated;
						
						// update resources.units["worker"].unallocated
						resources.units["worker"].allocated += element.allocatedUnits['worker'];
						resources.units["worker"].unallocated -= element.allocatedUnits['worker'];
					}
					x++;
				}, this);

				console.log('Post: Worker Allocation: ' + resources.units["worker"].allocated + '/' + resources.units["worker"].total + ' Unallocated: ' + resources.units["worker"].unallocated);

				// update needs for each motivation
				motivationSupplyController.updateNeeds(roomName);

			}
		}
	},

	"init": function ()
	{
		// init motivations in each room we control
		for (var roomName in Game.rooms)
		{
			var room = Game.rooms[roomName];
			if (room.controller.my)
			{
				// init motivations in memory
				if (lib.isNull(room.memory.motivations))
				{
					room.memory.motivations = {};
				}

				// init each motivation for this room
				motivationSupplySpawn.init(room.name);
				motivationSupplySpawn.setPriority(room.name, C.PRIORITY_1);
				motivationSupplyController.init(room.name);
				motivationSupplyController.setPriority(room.name, C.PRIORITY_3);
			}
		}
	}
};