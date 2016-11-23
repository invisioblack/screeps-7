//-------------------------------------------------------------------------
// jobCollect
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
	var jobCollect = function ()
	{
	};
	//-------------------------------------------------------------------------

	jobCollect.work = function (creep)
	{
		//avoid hostiles
		if (creep.avoidHostile(creep , 5))
		{
			return;
		}

		// if collector is assigned something to collect handle the collection
		if (creep.memory.collect)
		{   // we're assigned a pickup, let's try to pick it up
			var dropped = Game.getObjectById(creep.memory.collect);
			jobCollect.getEnergy(creep , dropped);
		}
		else
		{   // we're not assigned a pickup, lets try to return energy
			jobCollect.returnEnergy(creep);
		}
	};

	jobCollect.returnEnergy = function (creep)
	{
		// find spawn to return energy too
		var spawn = Game.spawns[creep.memory.spawn];
		if (!spawn)
		{
			spawn = creep.pos.findNearest(Game.MY_SPAWNS);
		}

		// confirm that collection assignment is cleared
		creep.memory.collect = null;

		if (creep.energy > 0)
		{   // return the energy
			creep.moveTo(spawn);
			creep.transferEnergy(spawn);
		}
		else
		{
			jobCollect.idle(creep);
		}
	};

	jobCollect.getEnergy = function (creep , dropped)
	{
		// confirm the dropped item exists and is in this room
		if (dropped && dropped.room == creep.room)
		{   // do we have room to pick up the energy?
			if (creep.energy < creep.energyCapacity)
			{
				creep.moveTo(dropped);
				creep.pickup(dropped);
			}
			else
			{   // if we don't have any space, return the energy
				jobCollect.returnEnergy(creep);
			}
		}
		else
		{
			// the assignment is invalid, so reset it
			creep.memory.collect = null;
			jobCollect.returnEnergy(creep);
		}
	};

	jobCollect.idle = function (creep)
	{
		// TODO: handle idle behavior
	};

	//-------------------------------------------------------------------------
	//return populated object
	return jobCollect;

};