/***********************************************************************************************************************
 * Cache Manager
 *  Manages both global and memory caching
 */
"use strict";

module.exports = {
	init: function () {
		// init global cache
		lib.isNull(global.cache);
		{
			global.cache = {};
		}

		// init function memCache
		if (lib.isNull(Memory.cacheFunction))
		{
			Memory.cacheFunction = {};
		}
	},

	/**
	 * this generates a key for storage of a value in the mem cache. This currently does NOT support any arguments that
	 * cannot be converted into a string automatically.
	 * @param name
	 * @param args
	 */
	genKey: function(name, args)
	{
		let key = name;
		_.forEach(args, function (k) { key += k});
		return key;
	},

	storeMem: function(cache, key, value, time)
	{
		Memory[cache][key] = {
			value: value,
			time: time,
			valid: true
		}
	},

	fetchMem: function(cache, key)
	{
		let result = Memory[cache][key];
		if (lib.isNull(result))
		{
			result = { value: null, time: 0, valid: false };
		}
		return result;
	},

	dirtyMem: function (cache, key)
	{
		if (!lib.isNull(Memory[cache][key]))
		{
			Memory[cache][key].valid = false;
		}
	},

	flushMem: function (cache)
	{
		Memory[cache] = {};
	}
};