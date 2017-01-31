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
		} ,

		tickTrack: function ()
		{
			let result = {};
			let tenTick , hunTick , thouTick, bucketChange;

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
			result.panic = !Memory.cpu.active;

			Memory.cpu.tickTrack.unshift(result);

			if (Memory.cpu.tickTrack.length > config.cpuHistorySize)
			{
				Memory.cpu.tickTrack.pop();
			}

			if (config.cpuDebug)
			{
				let ticks = _.take(Memory.cpu.tickTrack , 10);
				let panics = _.sum(Memory.cpu.tickTrack, 'panic');
				tenTick = (_.sum(ticks , t => t.used) / 10).toFixed(1);
				ticks = _.take(Memory.cpu.tickTrack , 100);
				hunTick = (_.sum(ticks , t => t.used) / 100).toFixed(1);
				thouTick = (_.sum(Memory.cpu.tickTrack , t => t.used) / Memory.cpu.tickTrack.length).toFixed(1);
				bucketChange = result.bucketChange.toFixed(1);
				lib.log(`Tick: ${result.tick}\tAve 10/100/1000: ${tenTick}/${hunTick}/${thouTick}\tPanics: ${panics}\tUsed CPU: ${result.used.toFixed(1)}\t<progress value="${result.used}" max="${result.limit}"></progress>\tC/R: ${(result.used/_.size(Game.creeps)).toFixed(1)}/${(result.used/_.size(Game.rooms)).toFixed(1)}\tBucket: ${bucketChange > 0 ? result.bucket + "(+" + bucketChange + ")" : result.bucket + "(" + bucketChange + ")"}` , config.cpuDebug);
			}
		} ,

		log: function (message)
		{
			global.cpuUsed = Game.cpu.getUsed();
			let cpuDiff = cpuUsed - cpuUsedLast;
			let green = "#00BB11";
			let yellow = "#AAAA00";
			let red = "#CC0011";
			let color = "#00BB11";

			if (cpuDiff > 1)
			{
				color = yellow;
			}
			if (cpuDiff >= 5)
			{
				color = red;
			}

			lib.log(`${message}\t CPU Used Total: ${_.round(cpuUsed , 1)}\tCPU Used Diff: <span style=color:${color}>${_.round(cpuDiff , 1)}</span>` , config.cpuDetailDebug);
			global.cpuUsedLast = cpuUsed;
		} ,

		/**
		 *
		 * @param message
		 * @param key
		 */
		timerStart: function (message , key)
		{
			this.initMem();

			// insure memory structure exist
			if (lib.isNull(Memory.cpu.timer))
			{
				Memory.cpu.timer = {};
			}

			let result = {};

			result.message = message;
			result.key = key;
			result.time = Game.time;
			result.cpuStart = Game.cpu.getUsed();
			Memory.cpu.timer[key] = result;

		} ,

		timerStop: function (key , output = true , yellow = 1 , red = 5)
		{
			this.initMem();
			let color = C.COLOR_GREEN;
			let result = Memory.cpu.timer[key];

			if (lib.isNull(result))
			{
				console.log(`-- Timer Stop Failure! key: ${key}`);
				return;
			}

			result.cpuStop = Game.cpu.getUsed();
			result.cpuDiff = result.cpuStop - result.cpuStart;

			if (result.cpuDiff > yellow)
			{
				color = C.COLOR_YELLOW;
			}
			if (result.cpuDiff >= red)
			{
				color = C.COLOR_RED;
			}

			if (config.cpuDebug)
			{
				lib.log(`${result.message}\tCPU Used Total: ${result.cpuStop.toFixed(1)}\tCPU Used Diff: <span style=color:${color}>${result.cpuDiff.toFixed(1)}</span>` , output);
			}
		} ,

		getThrottleMode: function ()
		{
			let bucket = Game.cpu.bucket;
			if (bucket < config.cpuThresholdQuarter)
			{
				return C.CPU_THROTTLE_QUARTER;
			}
			else if (bucket < config.cpuThresholdHalf)
			{
				return C.CPU_THROTTLE_HALF;
			}
			else if (bucket < config.cpuThresholdThird)
			{
				return C.CPU_THROTTLE_THIRD;
			}
			else
			{
				return C.CPU_THROTTLE_NORMAL;
			}
		} ,

		getCPUActive: function (mode)
		{
			let pingPong;
			let color = "#AAAA00";

			switch (mode)
			{
				case C.CPU_THROTTLE_NORMAL:
					pingPong = 0;
					break;
				case C.CPU_THROTTLE_THIRD:
					pingPong = Game.time % 3;
					if (pingPong != 0)
					{
						pingPong = 0;
					}
					else
					{
						pingPong = 1;
					}
					break;
				case C.CPU_THROTTLE_HALF:
					pingPong = Game.time % 2;
					break;
				case C.CPU_THROTTLE_QUARTER:
					pingPong = Game.time % 4;
					break;
			}

			if (pingPong === 0)
			{
				Memory.cpu.active = true;
				return true;
			}
			else
			{
				console.log(`<span style=color:${color}>!!!!!!!!!! CPU PANIC !!!!!!!!!!</span>`);
				Memory.cpu.active = false;
				return false;
			}
		}

	};