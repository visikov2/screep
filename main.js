var performRoles = require('performRoles');
var spawner = require('spawner');
var factory = require('factory');
var constructionPlanner = require('constructionPlanner');

factory.init();
factory.run();

spawner.spawnNextInQue();

var baseBuild = factory.buildBaseWhileIdle();
if (!baseBuild) {
    factory.buildArmyWhileIdle();    
}

performRoles(Game.creeps);

constructionPlanner.buildRoadToAllSources();