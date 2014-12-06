module.exports = function () 
{
	//Define the return object
	var creepCost = function () {};

	//game costs for spawning parts
	creepCost.costs = {};
	creepCost.costs[Game.MOVE] = 50; 
	creepCost.costs[Game.WORK] = 20; 
	creepCost.costs[Game.CARRY] = 50;
	creepCost.costs[Game.ATTACK] = 100;
	creepCost.costs[Game.RANGED_ATTACK] = 150;
	creepCost.costs[Game.HEAL] = 200;
	creepCost.costs[Game.TOUGH] = 5;

	// returns cost for list of parts
	creepCost.getCostParts = function (parts) {
	    var result = 0;
	    if(parts.length)
	    {
	        for (var x in parts)
	        {
	            result += creepCost.costs[parts[x]];
	        }
	    }
	    return result;
	}

	//return the popoulated object
	return creepCost;
}