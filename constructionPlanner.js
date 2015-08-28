module.exports = {
	buildRoads: function(from, to)
	{
		var rooms = Game.rooms;
		for (var room in rooms) {
			var path = rooms[room].findPath(from, to, { ignoreCreeps: true });
			for(var i in path)
			{
				var result = rooms[room].createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
			}
		}
				
	},

	buildRoadToAllSources: function()
	{
		var rooms = Game.rooms;
		for (var room in rooms) {
		    if (typeof rooms[room].memory.hasRoads === "undefined" || !!rooms[room].memory.hasRoads === false) {
		        rooms[room].memory.hasRoads = true;
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
            	});
    
    			for(var i in sources)
    			{
    				this.buildRoads(Game.spawns.Spawn1.pos, sources[i].pos);
    			}
            }
		}
	},

	expandRampartsOutwards: function()
	{
		return false;
		var rooms = Game.rooms;
		for (var room in rooms) {
			var ramparts = rooms[room].find(FIND_MY_STRUCTURES, {
				filter: function(struct)
				{
					return struct.structureType == Game.STRUCTURE_RAMPART
				}
			});
		}

		for(var i in ramparts)
		{
			var rampart = ramparts[i];

			var positions = [
				[rampart.pos.x - 1, rampart.pos.y],
				[rampart.pos.x, rampart.pos.y - 1],
				[rampart.pos.x, rampart.pos.y - 1],
				[rampart.pos.x, rampart.pos.y + 1],
				[rampart.pos.x - 1, rampart.pos.y - 1],
				[rampart.pos.x + 1, rampart.pos.y - 1],
				[rampart.pos.x - 1, rampart.pos.y + 1],
				[rampart.pos.x - 1, rampart.pos.y - 1]
			];

			for(var i in positions)
			{
				var pos = positions[i];
				var tile = Game.getRoom('1-1').lookAt(pos[0], pos[1]);
				var build = true;
				for(var tilei in tile)
				{
					var thing = tile[tilei];
					if(thing.type == 'structure' && thing.structure.structureType == Game.STRUCTURE_RAMPART)
						build = false;
					if(thing.type == 'constructionSite')
						build = false;
				}

				if(build)
					Game.getRoom('1-1').createConstructionSite(pos[0], pos[1], Game.STRUCTURE_RAMPART);
			}
		}
	}
};