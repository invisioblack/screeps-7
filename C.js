//-------------------------------------------------------------------------
// C - constants
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// definition
//-------------------------------------------------------------------------
module.exports =
{
	//-----------------------------------------------------------------------------
	// jobs
	'JOB_NOTHING': 0 ,
	'JOB_BUILD': 1 ,
	'JOB_COLLECT': 2 ,
	'JOB_GUARD': 3 ,
	'JOB_HARVEST': 4 ,
	'JOB_HEAL': 5 ,
	'JOB_RANGED_GUARD': 6 ,
	'JOB_UNLOAD': 7 ,
	'JOB_RANGED_INVALID': 9999 ,

	//need weight
	'NEED_WEIGHT_CRITICAL': 256 ,
	'NEED_WEIGHT_HIGH': 128 ,
	'NEED_WEIGHT_MEDIUM': 64 ,
	'NEED_WEIGHT_LOW': 32 ,
	'NEED_WEIGHT_TRIVIAL': 16,

	//need scope
	'NEED_SCOPE_GLOBAL': 64,
	'NEED_SCOPE_ROOM': 32,
	'NEED_SCOPE_UNIT': 16,

    // need bonus/penalty
    'NEED_WEIGHT_BONUS': 1,
    'NEED_WEIGHT_PENALTY': -1

};