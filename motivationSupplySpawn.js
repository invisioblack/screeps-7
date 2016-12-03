//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib');
//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = 
{
	//-------------------------------------------------------------------------

	"init": function (roomName)
	{
		if (!this.getInit(roomName))
		{
			var room = Game.rooms[roomName];
			// init motivation object
			if (lib.isNull(room.memory.motivations["motivationSupplySpawn"]))
					room.memory.motivations["motivationSupplySpawn"] = {};
			
			// init default memory
			room.memory.motivations["motivationSupplySpawn"].name = "motivationSupplySpawn";
			this.setActive(roomName, false);
			
			// set init true
			Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].init = true;
		}
	},

	"getInit": function (roomName)
	{
		var room = Game.rooms[roomName];

		if (!lib.isNull(room.memory.motivations["motivationSupplySpawn"])
			&& room.memory.motivations["motivationSupplySpawn"].init) {
			 return true;
		} else {
			return false;
		}
	},

	"setActive": function (roomName, state)
	{
		if (state) {
			Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].active = true;
		} else {
			Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].active = false;
		}
	},

	"getActive": function (roomName)
	{
		if (Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].active) {
			 return true;
		} else {
			return false;
		}
	},

	"getDemands": function (roomName, spawnEnergy, workers)
	{
		var result = {};
		result.energy = spawnEnergy.energyCapacity - spawnEnergy.energy;
		result.workers = Math.floor(result.energy / 50);
		result.spawn = workers < result.workers;

		return result;
	}
};