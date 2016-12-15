//-------------------------------------------------------------------------
// jobHarvest
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
module.exports =
{
	//-------------------------------------------------------------------------

	"work": function (creep)
	{
		var need = Memory.needs[creep.memory.need];
		var target = Game.getObjectById(need.target);
		
		//avoid hostiles
		if (creep.avoidHostile(creep))
		{
			return;
		}

        if (creep.carryCapacity == 0 || _.sum(creep.carry) < creep.carryCapacity)
		{
		    console.log("harvest");
    		creep.moveTo(target);
	    	creep.harvest(target);
		}
        else
		{
		    console.log("return");
			var spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

			creep.moveTo(spawn);
			creep.transferEnergy(spawn);
		}
	}
};