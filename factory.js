var countType = require('countType');

module.exports ={
	init: function()
	{
		if(Memory.factoryInit != undefined) {
			return;
		}

		Memory.factoryInit = true;
		this.memory();
	},

	run: function()
	{
		this.spawnRequiredScreeps();
	},

	memory: function() {
		if(Memory.spawnQue == undefined) {
			Memory.spawnQue = [ ];
		}

		if(Memory.sources == undefined) {
			Memory.sources = { };
		}

		if(Memory.requiredScreeps == undefined)
		{
			Memory.requiredScreeps = [];
		    var rooms = Game.rooms;
    		for (var room in rooms) {
    			var sources = rooms[room].find(FIND_SOURCES, {
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
            			return true;
            		}
            	}).length;
    		}

    		for (var i = 0; i < sources; i++) {
    		    Memory.requiredScreeps.push("miner");
    		}
		}
	},
	
	spawnRequiredScreeps: function()
	{
	    
		var requiredScreeps = Memory.requiredScreeps;

		var gatheredScreeps = { };
		for(var index in requiredScreeps)
		{
			var type = requiredScreeps[index];

			if(gatheredScreeps[type] == undefined) {
				gatheredScreeps[type] = 0;
			}

			var neededToSkip = gatheredScreeps[type] + 1;

			var found = countType(type, true);
			if(neededToSkip > countType(type, true))
			{
				Memory.spawnQue.push(type);
			}
			gatheredScreeps[type]++;
		}
	},

	buildBaseWhileIdle: function()
	{
	    
	    var ret = false;
		for(var i in Game.spawns)
		{
			var spawn = Game.spawns[i];
			if(!spawn.spawning && !Memory.spawnQue.length && spawn.energy / spawn.energyCapacity >= 0.6) {
				var builders = countType('builder', true);
				var transporters = countType('transporter', true);

                if (builders < 6) {
                    if(transporters / builders < 0.25) {
    					require('spawner').spawn('transporter', { }, spawn);
    				}
    				else {
    					require('spawner').spawn('builder', { }, spawn);
    				}
    				ret = true;
                }
			}
		}
		
		return ret;
	},

	buildArmyWhileIdle: function()
	{
		for(var i in Game.spawns)
		{
			var spawn = Game.spawns[i];
			if(!spawn.spawning && !Memory.spawnQue.length && spawn.energy / spawn.energyCapacity >= 0.6) {
				var archers = countType('archer', true);
				var healers = countType('healer', true);

				if(healers / archers < 0.25) {
					require('spawner').spawn('healer', { }, spawn);
				}
				else {
					require('spawner').spawn('archer', { }, spawn);
				}
			}
		}
	}
};