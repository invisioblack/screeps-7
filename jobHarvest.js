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
		var need = creep.room.memory.motivations[creep.memory.motive.motivation].needs[creep.memory.motive.need];
		var source = Game.getObjectById(need.sourceId);
		var target = Game.getObjectById(need.targetId);
		
		//avoid hostiles
		if (creep.avoidHostile(creep))
		{
			return;
		}

        if (creep.carryCapacity == 0 || _.sum(creep.carry) < creep.carryCapacity)
		{
		    console.log("harvest");
    		creep.moveTo(source);
	    	creep.harvest(source);
		}
        else
		{
		    console.log("return");

			creep.moveTo(target);
			creep.transfer(target);
		}
	}
};