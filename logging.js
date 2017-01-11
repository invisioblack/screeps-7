"use strict";
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
		.filter( r => r.controller && r.getIsMine() )
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
	if (Memory.globalId === undefined || Memory.globalId > 10000) {
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
		.filter( r => r.controller && r.getIsMine() )
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
				if (type != STRUCTURE_CONTAINER && numPossible < 2500 && numStructures < numPossible) {
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
