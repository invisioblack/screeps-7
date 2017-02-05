"use strict";

// probably need specific
// sourceId:
// targetId:
// distance:

module.exports = function ()
{
	/**
	 * Need
	 * @constructor
	 */
	let Need = function ()
	{
	};

	Need.prototype.name = "Need";

	Need.prototype.fillUnitDemands = function (unitDemands)
	{
		_.forEach(units, (unit, unitName) =>
		{
			if (lib.isNull(unitDemands[unitName]))
			{
				unitDemands[unitName] = 0;
			}
		});
	};

	return Need;
};