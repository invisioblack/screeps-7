var jobManager = require('jobManager')();
var spawnManager = require('spawnManager')();

console.log("------ new tick ------");

//assign jobs
jobManager.assignJobs();

//assign spawns
spawnManager.spawn();

//action jobs
jobManager.actionJobs();
