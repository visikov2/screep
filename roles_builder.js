/**
 * @TODO: Make it more carry heavy, make it have helpers
 * @type {{parts: *[], getParts: getParts, action: action}}
 */
var builder = {
	parts: [
		[WORK,WORK,CARRY,MOVE],
//		[WORK,WORK,CARRY,CARRY,MOVE, MOVE, CARRY],
//		[WORK,WORK,CARRY,CARRY,MOVE, MOVE, CARRY, MOVE],
//		[WORK,WORK,CARRY,CARRY,MOVE, MOVE, CARRY, MOVE, WORK],
//		[WORK,WORK,CARRY,CARRY,MOVE, MOVE, CARRY, MOVE, WORK, MOVE],
//		[WORK,WORK,CARRY,CARRY,MOVE, MOVE, CARRY, MOVE, WORK, MOVE, CARRY]
	],

//	getParts: function()
//	{
//		var _= require('lodash');
//
//		var partsAllowed = getRoom('1-1').find(MY_STRUCTURES, {
//			filter: function(structure)
//			{
//				return (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 200);
//			}
//		}).length;
//
//		var parts = [ WORK, WORK, WORK, CARRY, MOVE ];
//		var modulo = partsAllowed % 2;
//		partsAllowed -= modulo;
//		partsAllowed /= 2;
//
//		if(partsAllowed > 5)
//			partsAllowed = 5;
//
//		for(var i = 0; i < partsAllowed; i++)
//			parts.push(MOVE, CARRY);
//
//		return parts;
//
//		return this.prototype.getParts.call(this);
//	},

	action: function()
	{
		var creep = this.creep;

		//If out of energy, go to spawn and recharge
		if(creep.carry.energy == 0) {
			var closestSpawn = creep.pos.findClosest(FIND_MY_SPAWNS, {
				filter: function(spawn)
				{
					return spawn.energy > 0 && creep.pos.inRangeTo(spawn, 3);
				}
			});
			if(closestSpawn) {
				creep.moveTo(closestSpawn);
				closestSpawn.transferEnergy(creep);
			}
		}
		else {
			//First, we're going to check for damaged ramparts. We're using ramparts as the first line of defense
			//and we want them nicely maintained. This is especially important when under attack. The builder will
			//repair the most damaged ramparts first
			var structures = creep.room.find(FIND_STRUCTURES);
			var damagedRamparts = [ ];

			for(var index in structures)
			{
				var structure = structures[index];
				if(structure.structureType == 'rampart' && structure.hits < (structure.hitsMax - 50))
					damagedRamparts.push(structure);
			}

			damagedRamparts.sort(function(a, b)
			{
				return(a.hits - b.hits);
			});

			if(damagedRamparts.length)
			{
				creep.moveTo(damagedRamparts[0]);
				creep.repair(damagedRamparts[0]);

				return;
			}

			//Next we're going to look for general buildings that have less than 50% health, and we'll go to repair those.
			//We set it at 50%, because we don't want builders abandoning their duty every time a road gets walked on
			var halfBroken = creep.room.find(FIND_STRUCTURES);
			var toRepair = [ ];
			for(var index in halfBroken)
				if((halfBroken[index].hits / halfBroken[index].hitsMax) < 0.5)
					toRepair.push(halfBroken[index]);

			if(toRepair.length)
			{
				var structure = toRepair[0];
				creep.moveTo(structure);
				creep.repair(structure);

				return;
			}

			//If no repairs are needed, we're just going to go find some structures to build
			var targets = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
			if(targets) {

				if(!creep.pos.isNearTo(targets))
					creep.moveTo(targets);

				//if(creep.pos.inRangeTo(targets, 0))
				//	creep.suicide();

				creep.build(targets);
				return;
			}

			var target = this.rangedAttack();
			if(target)
			{
				this.kite(target);
			}

			this.rest(true);
		}
	}
}

module.exports = builder;