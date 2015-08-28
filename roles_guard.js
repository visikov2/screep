/**
 * The Guard hasn't been improved in a while, I've mostly just moved on to archers for now. I'll come back and
 * work on this one later
 * @param creep
 */
var guard = {
	parts: [
		[TOUGH, MOVE, ATTACK, ATTACK]
	],

	action: function()
	{
		var creep = this.creep;

		var targets = creep.room.find(FIND_HOSTILE_CREEPS);
		if (targets.length) {
			creep.moveTo(targets[0]);
			creep.attack(targets[0]);
		}
		else {
			this.rest();
		}
	}
};

module.exports = guard;