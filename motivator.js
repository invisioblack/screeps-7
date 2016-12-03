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
	// Main motivator funtion, should be called first from main
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
				var spawnEnergy = resourceManager.getRoomSpawnEnergy(roomName);
				var workers = resourceManager.getRoomCreeps(roomName, 'worker');
				var collectorStatus = resourceManager.getCollectorStatus(roomName);
				console.log('Spawn Energy: ' + spawnEnergy.energy + '/' + spawnEnergy.energyCapacity);
				console.log('Workers: ' + workers);
				console.log('Collector Level: ' + collectorStatus.level + ' ' + collectorStatus.progress + '/' + collectorStatus.progressTotal + ' Downgrade: ' + collectorStatus.ticksToDowngrade);

				// determine motivation demands
				var demands = {};
				demands.motivationSupplySpawn = motivationSupplySpawn.getDemands(roomName, spawnEnergy, workers);
				demands.motivationSupplyController = motivationSupplyController.getDemands(roomName, collectorStatus, workers);
				console.log('Supply Spawn Demands: e: ' + demands.motivationSupplySpawn.energy + ' Workers: ' + demands.motivationSupplySpawn.workers + ' Spawn: ' + demands.motivationSupplySpawn.spawn);
				console.log('Supply Controller Demands: e: ' + demands.motivationSupplyController.energy + ' Workers: ' + demands.motivationSupplyController.workers + ' Spawn: ' + demands.motivationSupplyController.spawn);
			
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

				// decide motivator mode
				if (workers < 2)
				{
					this.mode = C.MOTIVATOR_MODE_SINGLE_MINDED;
				} else if (workers < 10) {
					this.mode = C.MOTIVATOR_MODE_LOPSIDED;
				} else {
					this.mode = C.MOTIVATOR_MODE_BALANCED;
				}

				// distribute resources to motivations

				// call motivations in priority
				
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
				motivationSupplyController.init(room.name);
			}
		}
	}
};