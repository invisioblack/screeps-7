//-------------------------------------------------------------------------
// jobBuild
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------

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

	motivationSupplySpawn.init = funtion (roomName)
	{
		if (!motivationSupplySpawn.getInit(roomName))
		{
			// init default memory
			motivationSupplySpawn.setActive(roomName, false);
			// set init true
			Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].init = true;
		}
	};

	motivationSupplySpawn.getInit = function (roomName)
	{
		if (Game.rooms[roomName].memory.motivations["motivationSupplySpawn"].init) {
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



	//-------------------------------------------------------------------------
	//return populated object
	return new MotivationSupplySpawn();
};