module.exports =
{
	initSpawnQue: function()
	{
		if(Memory.spawnQue == undefined)
			Memory.spawnQue = [ ];
	},

	addToQue: function(creep, unshift)
	{
		this.initSpawnQue();

		if(typeof unshift !== "undefined" && unshift === true)
			Memory.spawnQue.unshift(creep);
		else
			Memory.spawnQue.push(creep);
	},

	spawnNextInQue: function()
	{
		this.initSpawnQue();

		if(!Memory.spawnQue.length)
			return;
        
		var rooms = Game.rooms;
		var allSpawns = [];
		for (var room in rooms) {
			var spawns = rooms[room].find(FIND_MY_SPAWNS, {
				filter: function(spawn)
				{
					return spawn.spawning === undefined || spawn.spawning === null;
				}
			});
			for (var spawn in spawns) {
				allSpawns.push(spawns[spawn]);
			}
		}

		spawns = allSpawns;

		if(!spawns.length) 
			return;

		var role = Memory.spawnQue[0];

		if(typeof role == "string")
		{
			role = { type: role, memory: { } };
		}

		var me = this;
		var toSpawnAt = spawns.filter(function(spawn)
		{
			return me.canSpawn(spawn, role.type);
		});


		if(!toSpawnAt.length) 
			return;

		toSpawnAt = toSpawnAt[0];

        this.spawn(role.type, role.memory, toSpawnAt);

		Memory.spawnQue.shift();
	},

	spawn: function(role, memory, spawnPoint)
	{
		if(!spawnPoint)
			spawnPoint = Game.spawns.Spawn1;

		var manager = require('roleManager');

		if(!manager.roleExists(role))
		{
			return;
		}

		if(!this.canSpawn(spawnPoint, role))
		{
			return;
		}

		if(memory == undefined)
			memory = { };

		memory['role'] = role;
		spawnPoint.createCreep(manager.getRoleBodyParts(role, spawnPoint.room), null, memory);
	},

	canSpawn: function(spawnPoint, role)
	{
		if(typeof spawnPoint == "string" && role == undefined)
		{
			role = spawnPoint;
			spawnPoint = Game.spawns.Spawn1;
		}

		return spawnPoint.energy >= this.spawnCost(role, spawnPoint.room)
			&& (spawnPoint.spawning == null
				|| spawnPoint.spawning == undefined);
	},

	spawnCost: function(role, room)
	{
		var manager = require('roleManager');
		var parts = manager.getRoleBodyParts(role, room);

		var total = 0;
		for(var index in parts)
		{
			var part = parts[index];
			switch(part)
			{
				case MOVE:
					total += 50
					break;

				case WORK:
					total += 20
					break;

				case CARRY:
					total += 50
					break;

				case ATTACK:
					total += 100
					break;

				case RANGED_ATTACK:
					total += 150
					break;

				case HEAL:
					total += 200
					break;

				case TOUGH:
					total += 5
					break;
			}
		}

		return total;
	},

	killAll: function(role)
	{
		for(var i in Game.creeps) {
			if(role == undefined || Game.creeps[i].memory.role == role)
				Game.creeps[i].suicide();
		}
	}
}