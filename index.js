#!/usr/bin/env node
var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var _           = require('lodash');
var git         = require('simple-git')();
var touch       = require('touch');
var fs          = require('fs');
var files       = require('./lib/files.js');

var specs = require('./lib/specs.js')

splash = function() {
	clear();
	console.log(
		chalk.green(figlet.textSync('Gyst', { font: "doom", horizontalLayout: 'default' })),
		"\n",
		chalk.blue("version " + require('./package.json').version)
	);
}


splash();

process.argv.forEach((val, index) => {
  // console.log(`${index}) ${typeof val}: ${val}`);
  if (index > 1) { //skip node & script name
  	spec = files.asArray(`${process.cwd()}/${val}`);
  	specs.parse(spec);
  	// console.log();
  	// console.log(`${process.cwd()}/${val}`);
  	// console.log(files.asArray(`${process.cwd()}/${val}`));
  }
});

