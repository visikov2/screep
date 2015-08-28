var proto = require('role_prototype');

var archer = {
	parts: [
		[RANGED_ATTACK, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH],
		[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE],
		[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
		[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE]
	],

	/**
	 * Here we want Archer to automatically scale to however many extensions we have
	 * @returns {Array}
	 */
	getParts: function(room)
	{
	    return this.parts[0];
		var _= require('lodash');

		var partsAllowed = room.find(FIND_MY_STRUCTURES, {
			filter: function(structure)
			{
				return (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 200);
			}
		}).length;
		partsAllowed += 5;

		var modulo = partsAllowed % 2;
		partsAllowed -= modulo;
		partsAllowed /= 2;

		if(partsAllowed > 5) {
			partsAllowed = 5;
		}

		var parts = [ ];
		for(var i = 0; i < partsAllowed; i++) {
			//parts.unshift(RANGED_ATTACK);
			//parts.push(MOVE);
		}

		return parts;
	},

	/**
	 * @TODO: We need to get archers to prioritise their targets better
	 */
	action: function()
	{
		var creep = this.creep;

		var target = this.getRangedTarget();
		if(target !== null) {
			creep.rangedAttack(target);
		}

		//If there's not a target near by, let's go search for a target if need be
		if(target === null) {
			return this.rest();
		}

		this.kite(target);
		creep.rangedAttack(target);
	}
};

module.exports = archer;