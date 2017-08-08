#!/usr/bin/env node
var chalk       = require('chalk');
var clear       = require('clear');
var cli         = require('cli');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var GitHubApi   = require('github');
var _           = require('lodash');
var git         = require('simple-git')();
var touch       = require('touch');
var fs          = require('fs');
var files       = require('./lib/files.js');

// var { options } = require('./lib/options.js');
var { parse }   = require('./lib/parser.js')

splash = function() {
	clear();
	console.log(
		chalk.green(figlet.textSync('Gyst', { font: "doom", horizontalLayout: 'default' })),
		"\n",
		chalk.blue("version " + require('./package.json').version)
	);
}

args = process.argv;
args.shift();
args.shift();



splash();

args.forEach((val, index) => {
  // console.log(`${index}) ${typeof val}: ${val}`);
  // console.log(`${index}: "${val}"`)
	specFiles = files.ls(`${process.cwd()}/${val}`);
		specFile = specFiles.next();
		let lineNumber = 0;
		while (!specFile.done) {
			console.log("=======================");
			console.log(`Processing ${specFile.value}...`);
			console.log("=======================");
			specs = files.lines(specFile.value);
			line = specs.next();
		while (!line.done) {
			try {
				lineNumber++;
				parse(line.value);
			} catch(err) {
				console.log(`${err.message} (${specFile.value}:${lineNumber})`);
			}
	  		line = specs.next();
		}
			specFile = specFiles.next();
			console.log();
		}

  	// specs = files.lines(`${process.cwd()}/${val}`);

  	// while (line = specs.next()) {
  	// 	console.log(line);
  	// }
  	// console.log();
  	// spec = files.asArray(`${process.cwd()}/${val}`);
  	// specs.parse(spec);
  	// console.log();
  	// console.log(`${process.cwd()}/${val}`);
  	// console.log(files.asArray(`${process.cwd()}/${val}`));
  // }
});

