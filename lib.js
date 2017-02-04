"use strict";

module.exports =
	{
		/**
		 * Returns true is passed value meets a loose null criteria. Includes: undefined, null, Infinity and -Infinity.
		 * @param value
		 * @returns {boolean}
		 */
		"isNull": function (value)
		{
			if (typeof value === "undefined" || value === undefined || value === null || value === Infinity || value === -Infinity)
			{
				return true;
			}
			else
			{
				return false;
			}
		} ,

		/**
		 * Returns a clamped value of the passed value.
		 * @param value
		 * @param min
		 * @param max
		 * @returns {number}
		 */
		"clamp": function (value , min , max)
		{
			return Math.min(Math.max(value , min) , max);
		} ,

		/**
		 * Returns defaultValue is value is null.
		 * @param value
		 * @param defaultValue
		 * @returns {*}
		 */
		"nullProtect": function (value , defaultValue)
		{
			if (this.isNull(value))
			{
				value = defaultValue;
			}

			return value;
		} ,

		/**
		 * Outputs log message to console if output is true.
		 * @param message
		 * @param output
		 */
		"log": function (message , output)
		{
			if (output)
			{
				console.log(message);
			}
		}
	};