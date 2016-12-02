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
module.exports = function ()
{
	//declare base object
	var motivationSupplyController = function () {};
	//-------------------------------------------------------------------------

	motivationSupplyController.init = function (roomName)
	{
		if (!motivationSupplyController.getInit(roomName))
		{
			var room = Game.rooms[roomName];
			// init motivation object
			if (lib.isNull(room.memory.motivations["motivationSupplyController"]))
					room.memory.motivations["motivationSupplyController"] = {};
			
			// init default memory
			room.memory.motivations["motivationSupplyController"].name = "motivationSupplyController";
			motivationSupplyController.setActive(roomName, false);
			
			// set init true
			Game.rooms[roomName].memory.motivations["motivationSupplyController"].init = true;
		}
	};

	motivationSupplyController.getInit = function (roomName)
	{
		var room = Game.rooms[roomName];

		if (!lib.isNull(room.memory.motivations["motivationSupplyController"])
			&& room.memory.motivations["motivationSupplyController"].init) {
			 return true;
		} else {
			return false;
		}
	};

	motivationSupplyController.setActive = function (roomName, state)
	{
		if (state) {
			Game.rooms[roomName].memory.motivations["motivationSupplyController"].active = true;
		} else {
			Game.rooms[roomName].memory.motivations["motivationSupplyController"].active = false;
		}
	};

	motivationSupplyController.getActive = function (roomName)
	{
		if (Game.rooms[roomName].memory.motivations["motivationSupplyController"].active) {
			 return true;
		} else {
			return false;
		}
	};

	motivationSupplyController.getDemands = function (roomName, collectorStatus, workers)
	{
		var result = {};
		result.energy = collectorStatus.progressTotal - collectorStatus.progress;
		result.workers = Math.floor(result.energy / 50);
		result.spawn = workers < result.workers;

		return result;
	};

	//-------------------------------------------------------------------------
	//return populated object
	return motivationSupplyController;
};