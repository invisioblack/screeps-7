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
			if (lib.isNull(room.memory.motivations["motivationSupplyController"]))
					room.memory.motivations["motivationSupplyController"] = {};
			
			// init default memory
			room.memory.motivations["motivationSupplyController"].name = "motivationSupplyController";
			this.setActive(roomName, false);
			
			// set init true
			Game.rooms[roomName].memory.motivations["motivationSupplyController"].init = true;
		}
	},

	"getInit": function (roomName)
	{
		var room = Game.rooms[roomName];

		if (!lib.isNull(room.memory.motivations["motivationSupplyController"])
			&& room.memory.motivations["motivationSupplyController"].init) {
			 return true;
		} else {
			return false;
		}
	},

	"setActive": function (roomName, state)
	{
		if (state) {
			Game.rooms[roomName].memory.motivations["motivationSupplyController"].active = true;
		} else {
			Game.rooms[roomName].memory.motivations["motivationSupplyController"].active = false;
		}
	},

	"getActive": function (roomName)
	{
		if (Game.rooms[roomName].memory.motivations["motivationSupplyController"].active) {
			 return true;
		} else {
			return false;
		}
	},

	"getDemands": function (roomName, collectorStatus, workers)
	{
		var result = {};
		result.energy = collectorStatus.progressTotal - collectorStatus.progress;
		result.workers = Math.floor(result.energy / 50);
		result.spawn = workers < result.workers;

		return result;
	}
};