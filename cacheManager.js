/***********************************************************************************************************************
 * Cache Manager
 *  Manages both global and memory caching
 */
"use strict";

module.exports = {
	init: function () {
		// init global cache
		if (lib.isNull(global.cache))
		{
			global.cache = {};
		}

		if (lib.isNull(global.cache.rooms))
		{
			global.cache.rooms = {};
		}

		// init function memCache
		if (lib.isNull(Memory.cacheFunction))
		{
			Memory.cacheFunction = {};
		}
	}
};