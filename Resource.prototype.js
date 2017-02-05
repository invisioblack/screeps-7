if (Resource.prototype.hasOwnProperty('creepsOn') === false)
{
	Object.defineProperty(Resource.prototype , "creepsOn" , {
		get: function ()
		{
			return _.filter(Game.creeps , creep => !lib.isNull(creep.memory.sourceId) && creep.memory.sourceId === this.id);
		}
	});
}

module.exports = function ()
{
};