var gameManager = require('gameManager')();
var spawnManager = require('spawnManager')();
var creepCost = require('creepCost')();
var units = require('units');

console.log(creepCost.getCostParts(units.harvester));
console.log(creepCost.getCostParts(units.worker));
console.log(creepCost.getCostParts(units.guard));
console.log(spawnManager.getAvailableSpawn());