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

	// priority
	'PRIORITY_5': 8,
	'PRIORITY_4': 16,
	'PRIORITY_3': 24,
	'PRIORITY_2': 32,
	'PRIORITY_1': 40,

	//need weight
	'WEIGHT_CRITICAL': 256 ,
	'WEIGHT_HIGH': 128 ,
	'WEIGHT_MEDIUM': 64 ,
	'WEIGHT_LOW': 32 ,
	'WEIGHT_TRIVIAL': 16,
	'WEIGHT_NONE': 0,

	//need scope
	'SCOPE_GLOBAL': 64,
	'SCOPE_ROOM': 32,
	'SCOPE_UNIT': 16,

    // need bonus/penalty
    'BONUS': 1,
    'PENALTY': -1,

	// motivator mode
	'MOTIVATOR_MODE_SINGLE_MINDED': 1,
	'MOTIVATOR_MODE_SPLIT': 2,
	'MOTIVATOR_MODE_LOPSIDED': 3,
	'MOTIVATOR_MODE_BALANCED': 4,

	// override flag
	'OVERRIDE_AUTONOMOUS': 0,
	'OVERRIDE_PLAYER': 1
};