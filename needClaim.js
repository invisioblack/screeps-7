//-------------------------------------------------------------------------
// needClaim
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// modules
//-------------------------------------------------------------------------
// script prototypes
let Need = require('Need.prototype')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// function
//-------------------------------------------------------------------------
let NeedClaim = function ()
{
	Need.call(this);
	this.name = "needClaim";
};


NeedClaim.prototype = Object.create(Need.prototype);
NeedClaim.prototype.constructor = NeedClaim;

NeedClaim.prototype.getUnitDemands = function(roomName, memory, motivationName)
{
	let debug = false;
	let room = Game.rooms[roomName];
	let result = {};

	if (!lib.isNull(room) || !room.controller.my)
		result["claimer"] = 1;
	else
	{
		let spawnClaims = _.filter(Memory.claims, function (c){
			return c.spawnRoom === roomName;
		});
		result["claimer"] = spawnClaims;
	}

	lib.log(" Claim: " + JSON.stringify(result), debug);
	return result;
};

module.exports = new NeedClaim();