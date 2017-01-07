"use strict";

module.exports =
{
	initMem: function ()
	{
		// insure memory structure exist
		if (lib.isNull(Memory.cpu))
		{
			Memory.cpu = {};
		}
	},

	tickTrack: function ()
	{
		let result = {};
		let tenTick, hunTick, thouTick;

		this.initMem();
		// insure memory structure exist
		if (lib.isNull(Memory.cpu.tickTrack))
		{
			Memory.cpu.tickTrack = [];
		}

		result.tick = Game.time;
		result.used = Game.cpu.getUsed();
		result.limit = Game.cpu.limit;
		result.bucketChange = (result.used - result.limit) * -1;
		result.bucket = Game.cpu.bucket;

		Memory.cpu.tickTrack.unshift(result);

		if (Memory.cpu.tickTrack.length > config.cpuHistorySize)
			Memory.cpu.tickTrack.pop();


		if (config.cpuDebug)
		{
			let ticks = _.take(Memory.cpu.tickTrack, 10);
			tenTick = _.round(_.sum(ticks, function (t) { return t.used;})/10, 1);

			ticks = _.take(Memory.cpu.tickTrack, 100);
			hunTick = _.round(_.sum(ticks, function (t) { return t.used;})/100, 1);

			thouTick = _.round(_.sum(Memory.cpu.tickTrack, function (t) { return t.used;})/Memory.cpu.tickTrack.length, 1);

		}

		lib.log(`Tick: ${result.tick} Ave 10/100/All: ${tenTick}/${hunTick}/${thouTick} Used CPU: ${_.round(result.used, 1)}/${result.limit} Bucket: ${_.round(result.bucketChange, 1)}/${result.bucket}`, config.cpuDebug);

	},

	cpuLog: function (message)
	{
		global.cpuUsed = Game.cpu.getUsed();
		let cpuDiff = cpuUsed - cpuUsedLast;
		lib.log(`${message} CPU Used Total: ${_.round(cpuUsed, 1)} CPU Used Diff: ${_.round(cpuDiff, 1)}`, config.cpuDetailDebug);
		cpuUsedLast = cpuUsed;
	}

};