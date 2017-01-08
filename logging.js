/*
 * All of the code below here was provided by guys on the screeps slack.
 * If you haven't checked that out, do so now, it is awesome.
 * Huge props to all the guys for sharing this!
 */


/**
 * Favorite rooms of other players for sending resources with terminals
 * @type {string[]}
 */
global.favoriteTerminalTargets = ['W12S76'];

/**
 * Get <select> options for owned rooms
 * @param excludeRoom
 * @returns {string}
 */
global.showRoomSelectOptions = function (excludeRoom) {
	let outstr = `<option value="custom">Enter target room</option>`;
	let ownRooms = _.filter(Game.rooms, r => r.name != excludeRoom && r.controller && r.controller.my && r.terminal);
	ownRooms.forEach(r => {
		outstr += `<option value="${r.name}">${r.name}</option>`;
	});
	if (favoriteTerminalTargets) {
		outstr += `<optgroup label="Favorites">`;
		favoriteTerminalTargets.forEach(r => {
			outstr += `<option value="${r}">${r}</option>`;
		});
		outstr += '</optgroup>';
	}
	return outstr;
};

/**
 * Outputs the contents of any room object with a '.store' property in svg format.
 * Author: Helam
 * @param object {StructureStorage|StructureTerminal|StructureContainer}
 * @param vertical {boolean} (true will put a new line after each resource)
 * @param send {boolean} (whether or not to have the "send" button after each one)
 * @returns {string}
 */
global.showStore = function(object, vertical=false, send=false) {
	if (object.store) {
		var outstr = ``;
		var id;
		if (send) {
			id = getId();
			outstr += `Amount:<input style="color:black" type="text" id="amount${id}"/>\n`;
			outstr += `To Room:<select style="color:black" type="text" id="selectroom${id}">${showRoomSelectOptions(object.pos.roomName)}</select>\n`;
			outstr += `To Room:<input style="color:black" type="text" id="toroom${id}"/>\n`;
		}

		Object.keys(object.store).forEach(function(type) {
			outstr += svgMineral(type, object.store[type]);
			if (send) {
				outstr += makeButton(id, type,'send', `function() { customCommand${id}${type}(\` Game.rooms.${object.room.name}.terminal.send('${type}', \${$('#amount${id}').val()}, '\${$('#selectroom${id}').val() == 'custom' ? $('#toroom${id}').val() : $('#selectroom${id}').val()}') \`) }`, true);
			}
			if (vertical) {
				outstr += `\n`;
			} else {
				outstr += `\t`;
			}
		});
		return outstr;
	} else {
		throw new Error(`Invalid argument to global.showStore()! Argument must be an object with a 'store' property.`);
	}
};

/**
 * Recursive utility function for creating a details tag.
 * Returns the html string for the details tag.
 * Creates subordinate details tags if the main one contains objects or arrays of objects.
 * Author: Helam
 * @param summary (value to be shown next to the dropdown arrow)
 * @param list (array or object whose properties or elements will be displayed when the tag is expanded)
 * @param depth (USED ONLY FOR LIMITING RECURSION. DONT TOUCH.)
 * @returns {*}
 */
global.showDetails = function(summary, list, depth = 0) {
	const RECURSION_LIMIT = 3; // can modify this, but must be limited due to memory cycles

	if (Memory.detailsIdCounter == undefined || Memory.detailsIdCounter > 1000) {
		Memory.detailsIdCounter = 0;
	}
	let detailsId = Memory.detailsIdCounter++;

	if (list == undefined) {
		list = summary;
	}

	// must limit this because it can recurse
	// infinitely if there are cycles in memory
	if (depth >= RECURSION_LIMIT) {
		return summary;
	}

	var outstr = `<details id="${detailsId}"><summary>${summary}</summary>`;
	outstr += `<ul>`;

	if (Array.isArray(list) && typeof list[0] !== 'object') {
		list.forEach( (element, index) => {
			let output;
			if (Array.isArray(element)) {
				output = element;
			} else if (typeof element === 'object') {
				output = showDetails(element, element, depth + 1);
			} else {
				output = element;
			}
			outstr += `<li>${index}: \t\t${output}</li>`
		})
	} else if (typeof list === 'object') {
		Object.keys(list).forEach( key => {
			let property = list[key];
			let output;
			if (Array.isArray(property) && typeof property[0] !== 'object') {
				output = property;
			} else if (typeof property === 'object') {
				output = showDetails(property, property, depth + 1);
			} else {
				output = property;
			}
			outstr += `<li>${key}: \t\t${output}</li>`
		})
	} else {
		return "invalid list argument";
	}

	outstr += `</ul>`;
	outstr += `</details>`;

	return outstr;
};

/**
 * Outputs an expandable details tag to the console that allows browsing the memory of an object.
 * Pass in an object with memory OR its id OR name
 * @param arg {Creep|Room|Structure|String} Anything with a '.memory' property basically
 * Author: Helam
 */
global.showMemory = function (arg) {
	let object = undefined;
	if (arg == undefined) {
		console.log(`<font color="#a52a2a">Undefined argument to global.showMemory()</font>`);
		return;
	} else if (typeof arg === 'object') {
		object = arg;
	} else if (typeof arg === 'string') {
		object = Game.creeps[arg] || Game.rooms[arg] || Game.flags[arg] || Game.getObjectById(arg);
	}

	if (object != undefined) {
		let memory = object.memory;

		if (memory != undefined) {
			let outstr = showDetails(object, memory);
			console.log(outstr);
		} else {
			console.log(`<font color="#a52a2a">Memory not defined for object ${object}. Arg: ${arg}`);
		}
	} else {
		console.log(`<font color="#a52a2a">No object found. Arg: ${arg}`);
	}
};

/**
 * returns string for a link that can be clicked from the console
 * to change which room you are viewing. Useful for other logging functions
 * Author: Helam
 * @param roomArg {Room|RoomObject|RoomPosition|RoomName}
 * @returns {string}
 */
global.roomLink = function(roomArg) {
	if (roomArg instanceof Room) {
		roomArg = roomArg.name;
	} else if (roomArg.pos != undefined) {
		roomArg = roomArg.pos.roomName;
	} else if (roomArg.roomName != undefined) {
		roomArg = roomArg.roomName;
	} else if (typeof roomArg === 'string') {
		roomArg = roomArg;
	} else {
		console.log(`Invalid parameter to roomLink global function: ${roomArg} of type ${typeof roomArg}`);
	}
	return `<a href="#!/room/${roomArg}">${roomArg}</a>`;
};

/**
 * console function that prints:
 *  Number of walls and ramparts as well as the average, min, and
 *  max hits for walls and ramparts in each claimed room.
 *  TODO: add coloring
 *  Author: Helam
 */
global.wallStatus = function() {
	var string = "===== Wall Status =====\n";

	// can modify this function to take advantage of your own structure caching
	function getRoomStructuresByType(room) {
		let structures = room.find(FIND_STRUCTURES);
		let structuresByType = _.groupBy(structures, 'structureType');
		return structuresByType;
		//return room.structuresByType;
	}

	Object.keys(Game.rooms).map(name => Game.rooms[name])
		.filter( r => r.controller && r.controller.my )
		.sort( (a,b) => b.controller.level - a.controller.level || b.controller.progress - a.controller.progress )
		.forEach( room => {

			string += `\nRoom ${roomLink(room.name)}\n`;

			let structuresByType = getRoomStructuresByType(room);
			let walls = (structuresByType[STRUCTURE_WALL] || []);
			let numWalls = walls.length;
			if (numWalls) {
				let maxWall = _.max(walls, 'hits').hits;
				let minWall = _.min(walls, 'hits').hits;
				let averageWall = _.sum(walls, 'hits') / numWalls;

				maxWall = (maxWall / 1000000).toFixed(3) + " M";
				minWall = (minWall / 1000000).toFixed(3) + " M";
				averageWall = (averageWall / 1000000).toFixed(3) + " M";
				string += `\tWALLS: x${numWalls}\tavg: ${averageWall}\tmin: ${minWall}\tmax: ${maxWall}\n`;
			} else {
				string += `\tNO WALLS\n`;
			}

			let ramparts = (structuresByType[STRUCTURE_RAMPART] || []);
			let numRamparts = ramparts.length;
			if (numRamparts) {
				let maxRampart = _.max(ramparts, 'hits').hits;
				let minRampart = _.min(ramparts, 'hits').hits;
				let averageRampart = _.sum(ramparts, 'hits') / numRamparts;

				maxRampart = (maxRampart / 1000000).toFixed(3) + " M";
				minRampart = (minRampart / 1000000).toFixed(3) + " M";
				averageRampart = (averageRampart / 1000000).toFixed(3) + " M";
				string += `\tRAMPARTS: x${numRamparts}\tavg: ${averageRampart}\tmin: ${minRampart}\tmax: ${maxRampart}\n`;
			} else {
				string += `\tNO RAMPARTS\n`;
			}
		});

	console.log(string);
};

/**
 * Used to create unique id numbers to use as the
 * id for html tags for later reference.
 * Author: Helam
 * @returns {*|number}
 */
global.getId = function() {
	if (Memory.globalId == undefined || Memory.globalId > 10000) {
		Memory.globalId = 0;
	}
	Memory.globalId = Memory.globalId + 1;
	return Memory.globalId;
};

/**
 * Returns html for a button that will execute the given command when pressed in the console.
 * @param id (from global.getId(), value to be used for the id property of the html tags)
 * @param type (resource type, pass undefined most of the time. special parameter for storageContents())
 * @param text (text value of button)
 * @param command (command to be executed when button is pressed)
 * @param browserFunction {boolean} (true if command is a browser command, false if its a game console command)
 * @returns {string}
 * Author: Helam
 */
global.makeButton = function(id, type, text, command, browserFunction=false) {
	var outstr = ``;
	var handler = ``;
	if (browserFunction) {
		outstr += `<script>var bf${id}${type} = ${command}</script>`;
		handler = `bf${id}${type}()`
	} else {
		handler = `customCommand${id}${type}(\`${command}\`)`;
	}
	outstr += `<script>var customCommand${id}${type} = function(command) { $('body').injector().get('Connection').sendConsoleCommand(command) }</script>`;
	outstr += `<input type="button" value="${text}" style="background-color:#555;color:white;" onclick="${handler}"/>`;
	return outstr;
};

/**
 * console function that prints:
 *  gcl status
 *  rcl status and significant missing structures for each claimed room
 */
global.roomLevels = function() {
	var gclString = `===== GCL =====`;
	var gclPercentage = ((Game.gcl.progress / Game.gcl.progressTotal) * 100.0).toFixed(2)
	gclString += `\n\tLEVEL: ${Game.gcl.level}\tprogress: ${gclPercentage} %\t<progress value="${Game.gcl.progress}" max="${Game.gcl.progressTotal}"></progress>`;
	var string = "\n===== Room Levels =====";

	// \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// change the contents of these 2 functions to take advantage of your own caching
	// commented out my own cached stuff to put in code that should work regardless of code base
	let structures = Object.keys(Game.structures).map(id=>Game.structures[id]);
	let structuresByRoom = _.groupBy(structures, s=>s.room.name);
	for (let roomName in structuresByRoom) structuresByRoom[roomName] = _.groupBy(structuresByRoom[roomName], 'structureType');
	function getRoomStructuresByType(room) {
		return structuresByRoom[room.name] || {};
		//return room.structuresByType;
	}
	let constructionSites = Object.keys(Game.constructionSites).map(id=>Game.constructionSites[id]);
	let sitesByRoom = _.groupBy(constructionSites, s=>s.pos.roomName);
	for (let roomName in sitesByRoom) sitesByRoom[roomName] = _.groupBy(sitesByRoom[roomName], 'structureType');
	function getRoomConstructionSitesByType(room) {
		return sitesByRoom[room.name] || {};
		//return room.constructionSitesByType;
	}
	// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

	Object.keys(Game.rooms).map(name => Game.rooms[name])
		.filter( r => r.controller && r.controller.my )
		.sort( (a,b) => b.controller.level - a.controller.level || b.controller.progress - a.controller.progress )
		.forEach( room => {
			let rclPercentage = ((room.controller.progress / room.controller.progressTotal) * 100.0).toFixed(1);
			rclPercentage = " " + rclPercentage;
			rclPercentage = rclPercentage.substring(rclPercentage.length - 4);

			string += `\n\n\tRoom ${roomLink(room.name)} :\tLevel ${room.controller.level}`;
			if (room.controller.level < 8) {
				string += `\t\tProgress: ${rclPercentage} %\t<progress value="${room.controller.progress}" max="${room.controller.progressTotal}"></progress>`;
			}

			let roomLevel = room.controller.level;
			Object.keys(CONTROLLER_STRUCTURES).forEach( type => {
				let numStructures = (getRoomStructuresByType(room)[type] || []).length;
				numStructures = numStructures + (getRoomConstructionSitesByType(room)[type] || []).length;
				let numPossible = CONTROLLER_STRUCTURES[type][roomLevel];
				if (type !== STRUCTURE_CONTAINER && numPossible < 2500 && numStructures < numPossible) {
					string += `\t | <font color="#00ffff">${type}'s missing: ${numPossible - numStructures}</font>`;
				}
			});
		});

	console.log(gclString + string);


};


// THE REMAINING CODE JUST NEEDS TO BE REQUIRED SOMEWHERE

/**
 * returns string for a link that can be clicked from the console
 * to change which room you are viewing. Useful for other logging functions
 * Author: Helam
 * @param roomArg {Room|RoomObject|RoomPosition|RoomName}
 * @returns {string}
 */
global.roomLink = function(roomArg) {
	if (roomArg instanceof Room) {
		roomArg = roomArg.name;
	} else if (roomArg.pos != undefined) {
		roomArg = roomArg.pos.roomName;
	} else if (roomArg.roomName != undefined) {
		roomArg = roomArg.roomName;
	} else if (typeof roomArg === 'string') {
		roomArg = roomArg;
	} else {
		console.log(`Invalid parameter to roomLink global function: ${roomArg} of type ${typeof roomArg}`);
	}
	return `<a href="#!/room/${roomArg}">${roomArg}</a>`;
};

/**
 * Takes a resource type constant as input and returns
 * the html/svg string for the icon of that resource
 * Author: Helam
 * @param resourceType
 * @param amount {0 by default, pass false to hide it}
 * @returns {string}
 */
global.svgMineral = function(resourceType, amount = 0) {
	var outstr = ``;

	let length = Math.max(1, Math.ceil(Math.log10(amount + 1)));
	let amountWidth = length * 10 + 5;

	if (amount === false)
		amountWidth = 0;

	let textDisplacement = 14;

	var finalWidth = 14 + amountWidth;

	outstr += `<svg width="!!" height="14">`;

	if (resourceType === RESOURCE_ENERGY) {
		outstr += `<circle cx="7" cy="7" r="5" style="fill:#FEE476"/>`;
	} else if (resourceType === RESOURCE_POWER) {
		outstr += `<circle cx="7" cy="7" r="5" style="fill:#F1243A"/>`;
	} else {
		let BASE_MINERALS = {
			[undefined]: {back: `#fff`, front: `#000`},
			[RESOURCE_HYDROGEN]: {back: `#4B4B4B`, front: `#989898`},
			[RESOURCE_OXYGEN]: {back: `#4B4B4B`, front: `#989898`},
			[RESOURCE_UTRIUM]: {back: `#0A5D7C`, front: `#48C5E5`},
			[RESOURCE_LEMERGIUM]: {back: `#265C42`, front: `#24D490`},
			[RESOURCE_KEANIUM]: {back: `#371A80`, front: `#9269EC`},
			[RESOURCE_ZYNTHIUM]: {back: `#58482D`, front: `#D9B478`},
			[RESOURCE_CATALYST]: {back: `#572122`, front: `#F26D6F`}
		};

		let COMPOUNDS = {
			U: {back: `#58D7F7`, front: `#157694`},
			L: {back: `#29F4A5`, front: `#22815A`},
			K: {back: `#9F76FC`, front: `#482794`},
			Z: {back: `#FCD28D`, front: `#7F6944`},
			G: {back: `#FFFFFF`, front: `#767676`},
			O: {back: `#99ccff`, front: `#000066`},
			H: {back: `#99ccff`, front: `#000066`}
		};

		let colors = BASE_MINERALS[resourceType];

		if (colors) {
			outstr += `<circle cx="7" cy="7" r="5" style="stroke-width:1;stroke:${colors.front};fill:${colors.back}"/>`;
			outstr += `<text x="7" y="8" font-family="Verdana" font-size="8" alignment-baseline="middle" text-anchor="middle" style="fill:${colors.front};font-weight:bold;">${resourceType === undefined ? '?' : resourceType}</text>`;
		} else {
			let compoundType = ['U', 'L', 'K', 'Z', 'G', 'H', 'O'].find(type=>resourceType.indexOf(type) !== -1);
			colors = COMPOUNDS[compoundType];
			if (colors) {
				let width = resourceType.length * 9;
				finalWidth += width;
				textDisplacement = width;
				outstr += `<rect x="0" y="0" width="${width}" height="14" style="fill:${colors.back}"/>`;
				outstr += `<text x="${width / 2.0}" y="8" font-family="Verdana" font-size="8" alignment-baseline="middle" text-anchor="middle" style="fill:${colors.front};font-weight:bold;">${resourceType}</text>`;
			} else {
				throw new Error(`Invalid resource type ${resourceType} in global.svgMineral()`);
			}
		}
	}
	if (amount !== false)
		outstr += `<text font-family="Verdana" font-size="10" x="${textDisplacement + amountWidth/2}" y="8" alignment-baseline="middle" text-anchor="middle" style="fill:white"> x ${amount.toLocaleString()}</text>`;
	outstr += `</svg>`;

	outstr = outstr.split('!!').join(finalWidth);

	return outstr;
};


/**
 * Takes a room and outputs the html/svg string for the storage and terminal of that room,
 * Work in progress.
 * Hovering over the storage just shows it contents.
 * Hovering over ther terminal will show a menu for sending resources via that terminal.
 * Currently this does not dynamically change the console output, though you can scroll down
 * in the console to see what value the terminal.send command returned and act accordingly.
 * Author: Helam
 * Tooltips: Dragnar
 * @param roomArg {Room|RoomName}
 * @returns {string}
 */
global.svgRoomStorage = function(roomArg) {
	var room;
	var storage;
	var terminal;
	if (roomArg instanceof Room) {
		room = roomArg;
	} else if (typeof roomArg === 'string') {
		room = Game.rooms[roomArg];
	}
	if (!room) throw new Error(`Invalid argument or no access to room in global.svgRoomStorage()`);

	storage = room.storage;
	terminal = room.terminal;

	var outstr = ``;

	outstr += `<style id="dropdownStyle">`;
	outstr += `.dropbtn {`;
	outstr += `background-color: #4CAF50;`;
	outstr += `color: white;`;
	outstr += `padding: 16px;`;
	outstr += `font-size: 16px;`;
	outstr += `border: none;`;
	outstr += `cursor: pointer;`;
	outstr += `}`;

	outstr += `.dropdown {`;
	outstr += `position: relative;`;
	outstr += `display: inline-block;`;
	outstr += `}`;

	outstr += `.dropdown-content {`;
	outstr += `display: none;`;
	outstr += `z-index: 1;`;
	outstr += `padding: 5px;`;
	outstr += `border-radius: 6px;`;
	outstr += `text-align: center;`;
	outstr += `position: absolute;`;
	outstr += `background-color: #f9f9f9;`;
	outstr += `min-width: 200px;`;
	outstr += `box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);`;
	outstr += `}`;

	outstr += `.dropdown-content a {`;
	outstr += `color: black;`;
	//outstr += `padding: 12px 16px;`;
	outstr += `text-decoration: none;`;
	outstr += `display: block;`;
	outstr += `}`;

	outstr += `.dropdown-content a:hover {background-color: #f1f1f1}`;

	outstr += `.dropdown:hover .dropdown-content {`;
	outstr += `display: block;`;
	outstr += `}`;

	outstr += `.dropdown:hover .dropbtn {`;
	outstr += `background-color: #3e8e41;`;
	outstr += `}`;
	outstr += `</style>`;


	outstr += `<style id="tooltipStyle">`;
	outstr += `.tool {`;
	outstr += `position: relative;`;
	outstr += `display: inline-block;`;
	outstr += `}`;
	outstr += `.tool .tip {`;
	outstr += `visibility: hidden;`;
	outstr += `width: 300px;`;
	outstr += `background-color: #111111`;//2c2c2c;`;
	outstr += `color: #000;`; //fff`;
	outstr += `text-align: center;`;
	outstr += `border-radius: 6px;`;
	outstr += `padding: 5px 0;`;
	outstr += `position: absolute;`;
	outstr += `z-index: 1;`;
	outstr += `opacity: 0;`;
	outstr += `transition: opacity 1s;`;
	outstr += `}`;
	outstr += `.tool .tipRight {`;
	outstr += `top: -5px;`;
	outstr += `left: 101%;`;
	outstr += `}`;
	outstr += `.tool:hover .tip {`;
	outstr += `visibility: visible;`;
	outstr += `opacity: 0.9;`;
	outstr += `}`;
	outstr += `.tool table {`;
	outstr += `text-align: left;`;
	outstr += `margin-left: 5px;`;
	outstr += `}`;
	outstr += `</style>`;

	outstr += `<span class="tool">`;
	outstr += `<span style="background-color:#000" class="tip">`;
	if (storage) {
		//outstr += `${JSON.stringify(storage.store)}`;
		outstr += showStore(storage, true);
	} else {
		outstr += `No Storage Built`;
	}
	outstr += `</span>`;
	outstr += `<svg width="50" height="60">`;
	outstr += `<path style="stroke-width: 1;stroke:#90BA94" d='M16 48 C18 52 38 52 40 48 C42 46 42 18 40 16 C38 12 18 12 16 16 C14 18 14 46 16 48' />`;
	outstr += `<path style="fill:#555555" d='M18 46 L38 46 L38 18 L18 18' />`;
	outstr += `<!-- coords of storage inner box -->`;
	outstr += `<!--<rect x="18" y="18" width="20" height="28" style="fill:#F1243A" />-->`;
	if (storage) {
		let capacity = storage.storeCapacity;
		let energy = storage.store[RESOURCE_ENERGY];
		let power = storage.store[RESOURCE_POWER] || 0;
		let other = _.sum(storage.store) - energy - power;

		const HEIGHT = 28;
		const START_Y = 18;

		let energyHeight = HEIGHT * (energy/capacity);
		let otherHeight = HEIGHT * (other/capacity) + energyHeight;
		let powerHeight = HEIGHT * (power/capacity) + otherHeight;

		outstr += `<!-- power -->`;
		outstr += `<rect x="18" y="${START_Y + (HEIGHT - powerHeight)}" width="20" height="${powerHeight}" style="fill:#F1243A" />`;
		outstr += `<!-- minerals -->`;
		outstr += `<rect x="18" y="${START_Y + (HEIGHT - otherHeight)}" width="20" height="${otherHeight}" style="fill:#FFFFFF" />`;
		outstr += `<!-- energy -->`;
		outstr += `<rect x="18" y="${START_Y + (HEIGHT - energyHeight)}" width="20" height="${energyHeight}" style="fill:#FEE476" />`;
	} else {
		outstr += `<path style="fill:red" d='M44 18 L42 16 L28 30 L14 16 L12 18 L26 32 L12 46 L14 48 L28 34 L42 48 L44 46 L30 32 Z' />`;
	}
	outstr += `</svg>`;
	outstr += `</span>`;

	outstr += `<span class="tool">`;
	outstr += `<span style="background-color:#000" class="tip">`;
	if (terminal) {
		//outstr += `${JSON.stringify(terminal.store)}`;
		outstr += showStore(terminal, true, true);
	} else {
		outstr += `No Terminal Built`;
	}
	outstr += `</span>`;
	outstr += `<svg width="50" height="60" style="transform:scale(1.2,1.2)">`;
	outstr += `<path vector-effect="non-scaling-stroke" style="stroke:#90BA94" d='M36 40 L42 32 L36 24 L28 18 L20 24 L14 32 L20 40 L28 46 Z' />`;
	outstr += `<path vector-effect="non-scaling-stroke" style="fill:#AAAAAA" d='M34 38 L38 32 L34 26 L28 22 L22 26 L18 32 L22 38 L28 42 Z' />`;
	outstr += `<path vector-effect="non-scaling-stroke" style="stroke-width:2;stroke:black;fill:#555555" d='M34 38 L34 32 L34 26 L28 26 L22 26 L22 32 L22 38 L28 38 Z' />`;
	if (terminal) {
		let capacity = terminal.storeCapacity;
		let energy = terminal.store[RESOURCE_ENERGY];
		let power = terminal.store[RESOURCE_POWER] || 0;
		let other = _.sum(terminal.store) - energy - power;

		const RADIUS = 6;

		const START_X = 22;
		const START_Y = 26;

		let energyRadius = RADIUS * (energy/capacity);
		let otherRadius = RADIUS * (other/capacity) + energyRadius;
		let powerRadius = RADIUS * (power/capacity) + otherRadius;

		let powerX = START_X + (RADIUS - powerRadius);
		let otherX = START_X + (RADIUS - otherRadius);
		let energyX = START_X + (RADIUS - energyRadius);

		let powerY = START_Y + (RADIUS - powerRadius);
		let otherY = START_Y + (RADIUS - otherRadius);
		let energyY = START_Y + (RADIUS - energyRadius);

		outstr += `<!-- power -->`;
		outstr += `<rect x="${powerX}" y="${powerY}" width="${powerRadius * 2}" height="${powerRadius * 2}" style="fill:#F1243A" />`;
		outstr += `<!-- minerals -->`;
		outstr += `<rect x="${otherX}" y="${otherY}" width="${otherRadius * 2}" height="${otherRadius * 2}" style="fill:#FFFFFF" />`;
		outstr += `<!-- energy -->`;
		outstr += `<rect x="${energyX}" y="${energyY}" width="${energyRadius * 2}" height="${energyRadius * 2}" style="fill:#FEE476" />`;
	} else {
		outstr += `<path style="fill:red" d='M44 18 L42 16 L28 30 L14 16 L12 18 L26 32 L12 46 L14 48 L28 34 L42 48 L44 46 L30 32 Z' />`;
	}
	outstr += `</svg>`;
	outstr += `</span>`;

	//console.log(outstr);
	return outstr;
};

/**
 * Console function: prints svg's showing the contents of
 * the storage and terminal for each claimed room.
 * If reactionTypeSetting is true, setting the reaction type
 * of a room will set the corresponding value in Memory.rooms[roomName].reactionType
 * Author: Helam, Dewey
 * @param reactionTypeSetting {boolean} (whether or not to include room reaction types and the menu for setting them)
 */
global.storageContents = function(reactionTypeSetting = true) {
	var outputString = "";
	outputString += '<div style="width:1200px">';

	var maxResources = 1;

	Object.keys(Game.rooms).map( name => Game.rooms[name])
		.filter(r => r.controller && r.controller.my)
		.sort( (a,b) => b.controller.level - a.controller.level || b.controller.progress - a.controller.progress )
		.forEach( room => {
			outputString += `<div class="row" style="white-space:normal;">`;
			// roomlink and mineral types
			outputString += `<div class="col-sm-1" style="width:60px"> ${roomLink(room)}\n`;
			outputString += `<span class="tool">`;
			outputString += `T:${svgMineral(room.mineralType, false)}\n`;
			outputString += `<span style="background-color:#000" class="tip">Room Mineral Type:\n${svgMineral(room.mineral.mineralType,room.mineral.mineralAmount)}${room.mineral.ticksToRegeneration != undefined ? `\nRegeneration in: ${room.mineral.ticksToRegeneration} ticks${Memory.averageTickLength ? `\n(${((room.mineral.ticksToRegeneration * Memory.averageTickLength) / 3600).toFixed(2)} hours)` : ``}` : ``}</span>`;
			outputString += `</span>`;
			if (reactionTypeSetting) {
				outputString += `<span class="dropdown">`;
				let reactionTypeId1 = getId();
				outputString += `R:<span id="${reactionTypeId1}">${svgMineral(room.reactionType, false)}</span>`;
				// vvvvvvvv tooltip
				let reactionTypeId2 = getId();
				outputString += `<div style="background-color:#000" class="dropdown-content">`;
				outputString += `Room Reaction Type: <span id="${reactionTypeId2}">${svgMineral(room.reactionType, false)}</span>\n`;
				let clearId = getId();
				outputString += makeButton(clearId, undefined, 'clear', `function() { customCommand${clearId}${undefined}('delete Memory.rooms.${room.name}.reactionType;'); document.getElementById('${reactionTypeId1}').innerHTML = \`${svgMineral(undefined,false)}\`; document.getElementById('${reactionTypeId2}').innerHTML = \`${svgMineral(undefined,false)}\`}`, true);
				outputString += `\n`;
				outputString += `${showReactions(room, reactionTypeId1, reactionTypeId2)}`;
				outputString += `</div>`;
				// /\/\/\/\ tooltip
				outputString += `</span>`;
			}
			outputString += `</div>`;

			outputString += '<div class="col-sm-1" style="width:130px">' + svgRoomStorage(room) + '</div>';
			if (room.storage) outputString += `<div class="col-sm-::"> Storage: \n${showStore(room.storage)} </div>`;
			if (room.terminal) outputString += `<div class="col-sm-?? col-sm-offset-1"> Terminal: \n${showStore(room.terminal)} </div>`;
			if (room.storage) maxResources = Math.max(Object.keys(room.storage.store).length, maxResources);
			outputString += `</div>`;
		});
	outputString += "</div>";

	let storageColumns = Math.min(5, maxResources);
	let terminalColumns = 10 - storageColumns - 1;

	console.log(storageColumns);
	console.log(terminalColumns);

	outputString = outputString.split(`::`).join(storageColumns);
	outputString = outputString.split(`??`).join(terminalColumns);

	console.log(outputString);
	//return outputString;
};

/**
 * Creates the contents of the menu for setting room reaction types.
 * Only shows a compound if the room's storage or terminal contains at least
 * one of the resources required for that reaction.
 * The buttons in the menu will change the svg tags in the console output to match
 * the new reaction type and will also set Memory.rooms[roomName].reactionType to the given mineral.
 * Author: Helam
 * @param room {Room}
 * @param reactionTypeId1 (id from getId() for one of the html tags that contains the svg for the reaction type of the room)
 * @param reactionTypeId2 (id from getId() for the other of the html tags that contains the svg for the reaction type of the room)
 * @returns {string}
 */
global.showReactions = function(room, reactionTypeId1, reactionTypeId2) {
	var ownedResources = new Set();
	if (room.storage)
		Object.keys(room.storage.store).forEach(t=>ownedResources.add(t));
	if (room.terminal)
		Object.keys(room.terminal.store).forEach(t=>ownedResources.add(t));

	var possibleReactions = new Set();
	ownedResources.forEach(resource1=>{
		let reactions = REACTIONS[resource1];
		if (reactions)
			Object.keys(reactions).map(resource2=>reactions[resource2]).forEach(product=>possibleReactions.add(product));
	});

	var outstr = ``;
	possibleReactions.forEach(product => {
		outstr += `${svgMineral(product,false)}`;
		let id = getId();
		outstr += makeButton(id, product,'set', `function() { customCommand${id}${product}(\`Memory.rooms.${room.name}.reactionType = '${product}'; \`); document.getElementById('${reactionTypeId1}').innerHTML = \`${svgMineral(product,false)}\`; document.getElementById('${reactionTypeId2}').innerHTML = \`${svgMineral(product,false)}\`; }`, true);
		outstr += `\n`;
	});
	return outstr;
};

/**
 * Returns the html for the svg representation of the given creep or creep name
 * Author: Helam
 * @param creep
 * @returns {string}
 */
global.svgCreep = function(creep) {
	function invalid() {
		console.log(`Invalid argument passed to global.svgCreep! arg: ${creep}`);
		return true;
	}
	if (!creep && invalid()) return;

	if (typeof creep === 'string') {
		creep = Game.creeps[creep];
		if (!creep && invalid()) return;
	}

	if (!(creep instanceof Creep) && invalid()) return;

	let PART_COLORS = {
		[CARRY]: undefined,
		[MOVE]: "#A9B7C6",
		[WORK]: "#FFE56D",
		[CLAIM]: "#B99CFB",
		[ATTACK]: "#F93842",
		[RANGED_ATTACK]: "#5D80B2",
		[HEAL]: "#65FD62",
		[TOUGH]: "#858585"
	};

	let BORDER_COLOR = "#202020";
	let INTERNAL_COLOR = "#555555";

	let BORDER_WIDTH = 8;
	let CENTER_X = 25;
	let CENTER_Y = 25;
	let RADIUS = 15;

	let TOUGH_EXTRA_RADIUS = 8;

	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	function describeArc(x, y, radius, startAngle, endAngle){

		var start = polarToCartesian(x, y, radius, endAngle);
		var end = polarToCartesian(x, y, radius, startAngle);

		var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

		var d = [
			"M", start.x, start.y,
			"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
		].join(" ");

		return d;
	}

	function partsArc(partType, partCount, prevPartCount) {
		if (partType === CARRY)
			return ``;

		let centerAngle;
		if (partType === MOVE)
			centerAngle = 180;
		else
			centerAngle = 0;

		let arcLength = ((prevPartCount + partCount) / 50.0) * 360.0;
		let startAngle = centerAngle - arcLength / 2.0;
		let endAngle = centerAngle + arcLength / 2.0;
		var arc = `<path d="${describeArc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle)}" fill="none" stroke="${PART_COLORS[partType]}" stroke-width="${BORDER_WIDTH}"/>`;
		return arc;
	}

	let parts = _.map(creep.body, b => b.type);
	let partCounts = _.countBy(parts);

	var outstr = ``;
	outstr += `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">`;

	// add tough circle
	let TOUGH_OPACITY = (partCounts[TOUGH] || 0) / 50.0;
	outstr += `<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="${RADIUS + TOUGH_EXTRA_RADIUS}" fill="${PART_COLORS[TOUGH]}" fill-opacity="${TOUGH_OPACITY}"/>`;

	// main body
	outstr += `<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="${RADIUS}" fill="${INTERNAL_COLOR}" stroke="${BORDER_COLOR}" stroke-width="${BORDER_WIDTH}"/>`;

	//console.log(JSON.stringify(partCounts));

	let arcs = [];

	let PRIO = {
		[CARRY]: 0,
		[MOVE]: 0,
		[WORK]: 1,
		[CLAIM]: 5,
		[ATTACK]: 2,
		[RANGED_ATTACK]: 3,
		[HEAL]: 4,
		[TOUGH]: 0
	};

	let keys = Object.keys(partCounts).sort( (a,b) => {
		return partCounts[b] - partCounts[a] || PRIO[b] - PRIO[a];
	});

	keys.reverse().reduce((partsTotal, type) => {
		if (type !== TOUGH) {
			if (type === MOVE) {
				arcs.push(partsArc(type, partCounts[type], 0));
				return partsTotal;
			} else {
				arcs.push(partsArc(type, partCounts[type], partsTotal));
				partsTotal += partCounts[type];
			}
		}
		return partsTotal;
	}, 0);

	arcs.reverse().forEach(arc => outstr += arc);

	outstr += `</svg>`;
	return outstr;
};