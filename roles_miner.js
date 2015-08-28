/**
 * This guy just finds a source, and stays near it. His job is just to mine away and let the energy fall on the ground
 *
 * @TODO: See if we can't implement preffered spawn spots close to their source
 * @param creep
 */
var miner = {
	parts: [
		[MOVE, WORK, WORK],
		[MOVE, WORK, WORK, WORK],
		[MOVE, WORK, WORK, WORK, WORK]
	],

	getOpenSource: function()
	{
	    var creep = this.creep;
	    var source = creep.pos.findClosest(FIND_SOURCES, {
    		filter: function(source)
    		{
    		    var hostiles = source.room.find(FIND_HOSTILE_STRUCTURES);
    		    var sx = source.pos.x;
    		    var sy = source.pos.y;
    		    for (var i in hostiles) {
    		        var hx = hostiles[i].pos.x;
    		        var hy = hostiles[i].pos.y;
        			if (Math.abs(hx - sx) < 5 && Math.abs(hy - sy) < 5) {
        			    return false;
        			}
    		    }
    			if(Memory.sources[source.id] == undefined || Memory.sources[source.id].miner == undefined || Memory.sources[source.id].miner == creep.id)
    				return true;
    
    			if(Game.getObjectById(Memory.sources[source.id].miner) == null)
    				return true;
    
    			return false;
    		}
    	});
    	
    	return source;
	},

	setSourceToMine: function(source)
	{
		var creep = this.creep;

		if(!source)
			return;

		if(Memory.sources[source.id] == undefined)
			Memory.sources[source.id] = { id: source.id };

		Memory.sources[source.id].miner = creep.id;
		creep.memory.source = source.id;

		var helperSpawn = source.pos.findClosest(FIND_MY_SPAWNS);
		var steps = helperSpawn.pos.findPathTo(source).length * 2;
		var creepsNeeded = Math.round((steps * 4) / 100);

		if (creepsNeeded > 5) {
			creepsNeeded = 5;
		}
		
		if (creepsNeeded <= 0) {
		    creepsNeeded = 1;
		}

		for(var i = 0; i < creepsNeeded; i++)
			Memory.spawnQue.unshift({ type: 'miner_helper', memory: {
				miner: creep.id
			}});

		creep.memory.helpersNeeded = creepsNeeded;
	},

	onSpawn: function()
	{
		var creep = this.creep;

		creep.memory.isNearSource = false;
		creep.memory.helpers = [];

		var source = this.getOpenSource();
		this.setSourceToMine(source);

		creep.memory.onCreated = true;
	},

	action: function()
	{
	    var creep = this.creep;

		//Basically, each miner can empty a whole source by themselves. Also, since they're slow, we don't have them
		//moving away from the source when it's empty, it'd regenerate before they got to another one.
		//For this, we assign one miner to one source, and they stay with it
		var source = Game.getObjectById(creep.memory.source);

		if(source == null) {
			var source = this.getOpenSource();

			if(!source)
				return;

			this.setSourceToMine(source);
		}

		if(creep.pos.inRangeTo(source, 5))
			creep.memory.isNearSource = true;
		else
			creep.memory.isNearSource = false;

		if(Memory.sources[source.id] == undefined)
			Memory.sources[source.id] = { id: source.id };

		Memory.sources[source.id].miner = creep.id;

		creep.moveTo(source);
		creep.harvest(source);
	}
};

module.exports = miner;