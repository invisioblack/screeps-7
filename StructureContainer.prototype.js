if (StructureContainer.prototype.hasOwnProperty('carrying') === false)
{
	Object.defineProperty(StructureContainer.prototype , "carrying" , {
		get: function ()
		{
			return _.sum(this.store);
		}
	});
}