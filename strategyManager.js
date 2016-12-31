//------------------------------------------------------------------------------
// strategyManager
//------------------------------------------------------------------------------

module.exports =
{
	//--------------------------------------------------------------------------
	// Declarations
	//--------------------------------------------------------------------------

	//--------------------------------------------------------------------------
	// top level functions
	//--------------------------------------------------------------------------

	// these functions differ than the ones in Room in that these do not require visibility of the room
	// and they do not require the unit to be in the room, just assigned to whatever is specified

	"countUnits": function (unitName)
	{
		let result = this.getUnits(unitName).length;
		return result;
	},

	"getUnits": function (unitName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.unit == unitName;
		});
		return result;
	},

	"countRoomUnits": function (roomName, unitName)
	{
		let result = this.getRoomUnits(roomName, unitName).length;
		return result;
	},

	"getRoomUnits": function (roomName, unitName)
	{
		let result = _.filter(Game.creeps , function (creep)
		{
			return creep.memory.motive.room == roomName
				&& creep.memory.unit == unitName;
		});
		return result;
	}
};