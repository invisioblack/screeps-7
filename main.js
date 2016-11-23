//-------------------------------------------------------------------------
// Main
//-------------------------------------------------------------------------
console.log("++++++ new tick ++++++");

//-------------------------------------------------------------------------
// Modules
//-------------------------------------------------------------------------
require('pSource')();
require('pCreep')();
var motivator = require('motivator')();
var needManager = require('needManager')();

//var jobManager = require('jobManager')();
//var spawnManager = require('spawnManager')();

//-------------------------------------------------------------------------
// Declarations
//-------------------------------------------------------------------------

// init
//spawnManager.init();

//update needs
//needsManager.updateNeeds();

//assign jobs / spawns
//needsManager.manageNeeds();

//spawn
//spawnManager.spawn();

//action jobs
//jobManager.actionJobs();

console.log("------ end tick ------");