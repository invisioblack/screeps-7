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
var needManager = require('needManager');

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
		var room;

		// motivate in each room we control
		for (var roomName in Game.rooms)
		{
			room = Game.rooms[roomName];
			if (room.controller.my)
			{
				//------------------------------------------------------------------------------------------------------
				// motivate
				console.log('+motivator.motivate: ' + roomName);

				// declarations ----------------------------------------------------------------------------------------
				var resources = {};
				var demands = {};
				var sortedMotivations;
				var isSpawnAllocated = false;
				var x = 1;

				// set up hack motivations reference -------------------------------------------------------------------
				var motivations = {};
				motivations["motivationSupplySpawn"] = motivationSupplySpawn;
				motivations["motivationSupplyController"] = motivationSupplyController;
				
				// determine room resources ----------------------------------------------------------------------------
				// energy
				resources.spawnEnergy = resourceManager.getRoomSpawnEnergy(roomName);
				// units
				// TODO: dynamically loop over unit types
				resources.units = [];
				resources.units['worker'] = {};
				resources.units['worker'].total = resourceManager.countRoomUnits(roomName, 'worker');
				resources.units["worker"].allocated = 0; // reset worker allocation
				resources.units["worker"].unallocated = resources.units["worker"].total;

				// get room collector status
				resources.controllerStatus = resourceManager.getControllerStatus(roomName);
				console.log('Controller Level: ' + resources.controllerStatus.level + ' ' + resources.controllerStatus.progress + '/' + resources.controllerStatus.progressTotal + ' Downgrade: ' + resources.controllerStatus.ticksToDowngrade);

				// -----------------------------------------------------------------------------------------------------
				// process motivations in order of priority ------------------------------------------------------------
				// get sorted motivations
				sortedMotivations = _.sortByOrder(Memory.rooms[roomName].motivations, ['priority'], ['desc']);

				// update each motivation in memory --------------------------------------------------------------------
				sortedMotivations.forEach(function(motivation) {
					console.log("+Motivating: " + motivation.name);

					// set up demands
					demands[motivation.name] = motivations[motivation.name].getDemands(roomName, resources);

					// decide which motivations should be active
					if (demands[motivation.name].energy > 0)
						motivations[motivation.name].setActive(roomName, true);
					else
						motivations[motivation.name].setActive(roomName, false);

					// allocate spawn ---------------------------------------------
					if (!isSpawnAllocated && motivation.active && demands[motivation.name].spawn > 0) {
						motivation.spawnAllocated = true;
						isSpawnAllocated = true;
					} else {
						motivation.spawnAllocated = false;
					}

					// allocate units ----------------------------------------------------------------------------------
					// TODO: This needs to loop over unit types
					if (motivation.active)
					{
						console.log('Pre: Worker Allocation: ' + resources.units["worker"].allocated + '/' + resources.units["worker"].total + ' Unallocated: ' + resources.units["worker"].unallocated);
						// calculate diminishing number of workers on each iteration
						var workersToAllocate = Math.ceil(resources.units["worker"].unallocated / (2 * x));

						// don't allocate more workers than demanded
						if (workersToAllocate > demands[motivation.name].units["worker"])
							workersToAllocate = demands[motivation.name].units["worker"];

						// apply workers bounded by number available
						if (workersToAllocate <= resources.units["worker"].unallocated)
							motivation.allocatedUnits['worker'] = workersToAllocate;
						else
							motivation.allocatedUnits['worker'] = resources.units["worker"].unallocated;

						// update resources.units["worker"].unallocated
						resources.units["worker"].allocated += motivation.allocatedUnits['worker'];
						resources.units["worker"].unallocated -= motivation.allocatedUnits['worker'];
						console.log('Worker Allocation: ' + resources.units["worker"].allocated + '/' + resources.units["worker"].total + ' Unallocated: ' + resources.units["worker"].unallocated);
					}

					// processes needs for motivation ------------------------------------------------------------------
					needManager.manageNeeds(roomName, motivations[motivation.name], motivation);

					// spawn units if allocated spawn ------------------------------------------------------------------
					var unitName = motivations[motivation.name].desiredSpawnUnit();
					if (motivation.spawnAllocated)
					{
						// TODO: assign the spawn dynamically
						if (unitName == "worker" && resourceManager.countRoomUnits(roomName, unitName) < 2)
							Game.spawns.Spawn1.spawnUnit(unitName, false);
						else
							Game.spawns.Spawn1.spawnUnit(unitName, true);
					}
					x++;

					// fulfill needs -----------------------------------------------------------------------------------
					needManager.fulfillNeeds(roomName);
				}, this);
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