//-------------------------------------------------------------------------
// lib
//-------------------------------------------------------------------------
"use strict";

module.exports =
	{
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

		"clamp": function (value , min , max)
		{
			return Math.min(Math.max(value , min) , max);
		} ,

		"nullProtect": function (value , defaultValue)
		{
			if (this.isNull(value))
			{
				value = defaultValue;
			}

			return value;
		} ,

		"log": function (message , output)
		{
			if (output)
			{
				console.log(message);
			}
		}
	};