//-------------------------------------------------------------------------
// Main
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Modules
//-------------------------------------------------------------------------
// game prototypes
require('prototype.creep')();
require('prototype.source')();
require('prototype.spawn')();
require('prototype.structureTower')();

// library modules
var C = require('C');
var lib = require("lib");

// game modules
var motivator = require('motivator');

module.exports.loop = function ()
{
	//-------------------------------------------------------------------------
	// Declarations
	//-------------------------------------------------------------------------
		var active = true;

	//-------------------------------------------------------------------------
	// Do stuffs
	//-------------------------------------------------------------------------
		console.log("++++++ new tick ++++++");
		if (active)
		{
			cleanupMemory();
			motivator.init();
			motivator.motivate();
		}

	//-------------------------------------------------------------------------
	// END
	//-------------------------------------------------------------------------
	console.log("------ end tick ------");
};

function cleanupMemory ()
{
    for(var i in Memory.creeps) {
        if(!Game.creeps[i])
            delete Memory.creeps[i];
    }

    for(var i in Memory.rooms) {
        if(!Game.rooms[i])
            delete Memory.rooms[i];
    }
}