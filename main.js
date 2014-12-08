var jobManager = require('jobManager')();
var spawnManager = require('spawnManager')();

console.log("------ new tick ------");

//assign spawns
spawnManager.spawn();

//assign jobs
jobManager.assignJobs();

//action jobs
jobManager.actionJobs();
