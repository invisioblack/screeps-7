//-------------------------------------------------------------------------
// Room.prototype
//-------------------------------------------------------------------------

module.exports = function()
{
	Room.prototype.getCostParts = function (parts)
	{
		var result = 0;
		if (parts.length)
		{
			for (var x in parts)
			{
				//console.log("P: " + parts[x]);
				result += Spawn.prototype.getCostParts.costs[parts[x]];
			}
		}
		return result;
	};

};