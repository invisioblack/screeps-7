//------------------------------------------------------------------------------
// needManager
// The need manager is responsible for assigning and reassigning needs to the
// resources they need to be fullfilled. In most cases this means assigning a
// creep to fulfill the task, but in some cases it will be things like asking 
// the spawn to build another unit.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// modules
//------------------------------------------------------------------------------
// library modules
var C = require('C');
var lib = require('lib');

// game modules


//------------------------------------------------------------------------------
// Declarations
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// function
//------------------------------------------------------------------------------
module.exports = 
{
	//--------------------------------------------------------------------------
	// Declarations
    //--------------------------------------------------------------------------

	//--------------------------------------------------------------------------
	// top level functions
	//--------------------------------------------------------------------------
	"manageNeeds": function (roomName, motivation, motivationMemory)
	{
		// create and update needs for motivation
		console.log("needManager.manageNeeds: motivation.name: " + motivation.name);
		motivation.updateNeeds(roomName);

		// loop over each need processing them
		// TODO: HERE
		// allocate / cull creeps to needs that are allocated to this motivation

		// call need.manage() for each need
		// need manage will assign jobs to allocated creeps
	}
};