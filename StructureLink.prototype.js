var _transferEnergy = StructureLink.prototype.transferEnergy;
StructureLink.prototype.transferEnergy = function(target, amount) {
	if( !target || !(target instanceof StructureLink) ) {
		return ERR_INVALID_TARGET;
	}

	if( target && target.isReceiving )
		return ERR_BUSY;

	var status;
	switch( (status=_transferEnergy.apply(this, arguments)) ) {
		case OK:
			target.isReceiving = true;
			break;
	}
	return status;
};

module.exports = function() {};