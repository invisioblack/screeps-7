
RoomPosition.prototype.isEnclosed = function() {
	let room = Game.rooms[this.roomName];
	let exits = room.find(FIND_EXIT);
	let opts = {
		plainCost: 1,
		swampCost: 1,
		maxRooms: 1,
		roomCallback: function(r) {
			let cm = new PathFinder.CostMatrix;
			_(room.find(FIND_STRUCTURES))
			// .filter(i => i.structureType === STRUCTURE_RAMPART || i.structureType === STRUCTURE_WALL)
				.filter(i => i instanceof StructureRampart || i instanceof StructureWall)
				.each(s => cm.set(s.pos.x, s.pos.y, 255)).commit();
			return cm;
		}
	};
	return this.search(
		_.map(exits, e => ({pos: e, range: 0})),
		opts
	).incomplete;
};