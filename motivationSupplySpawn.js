//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
var lib = require('lib')();
//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
module.exports = function ()
{
	//declare base object
	var motivationSupplySpawn = function () {};
	//-------------------------------------------------------------------------

	motivationSupplySpawn.init = function (roomName)
	{
		if (!motivationSupplySpawn.getInit(roomName))
		{
			var room = Game.rooms[roomName];
			// init motivation object
			if (lib.isNull(room.memory.motivations["motivationSupplySpawn"]))
					room.memory.motivations["motivationSupplySpawn"] = {};
			
			// init default memory
			room.memory.motivations["motivationSupplySpawn"].name = "motivationSupplySpawn";
			motivationSupplySpawn.setActive(roomName, false);
			
			// set init true
			Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].init = true;
		}
	};

	motivationSupplySpawn.getInit = function (roomName)
	{
		var room = Game.rooms[roomName];

		if (!lib.isNull(room.memory.motivations["motivationSupplySpawn"])
			&& room.memory.motivations["motivationSupplySpawn"].init) {
			 return true;
		} else {
			return false;
		}
	};

	motivationSupplySpawn.setActive = function (roomName, state)
	{
		if (state) {
			Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].active = true;
		} else {
			Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].active = false;
		}
	};

	motivationSupplySpawn.getActive = function (roomName)
	{
		if (Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].active) {
			 return true;
		} else {
			return false;
		}
	};

	motivationSupplySpawn.getDemands = function (roomName, spawnEnergy, workers)
	{
		var result = {};
		result.energy = spawnEnergy.energyCapacity - spawnEnergy.energy;
		result.workers = Math.floor(result.energy / 50);
		result.spawn = workers < result.workers;

		return result;
	};

	//-------------------------------------------------------------------------
	//return populated object
	return motivationSupplySpawn;
};