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
var _ = require('lodash');
var C = require('C');
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
	var motivator = function () {};
	//-------------------------------------------------------------------------
	// Main motivator funtion, should be called first from main
	motivator.motivate = function ()
	{
		
	};

	motivator.init = function ()
	{


		// init motivations in each room we control
		for (var room in Game.rooms)
		{
			if (room.controller.my)
			{
				// init motivations in memory
				if (lib.isNull(room.memory.motivations))
				{
					room.memory.motivations = {};
				}

				// init each motivation for this room
				motivationSupplySpawn.init(room.name);
			}
		}
	};

	//-------------------------------------------------------------------------
	//return populated object
	return motivator;
};