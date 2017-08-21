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
var lexer       = require('./lib/lexer.js');
var { heading } = require('./lib/common.js')

// var { options } = require('./lib/options.js');
var catalog   = require('./lib/catalog.js')

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


// catalog.context("fnord");
// catalog.set("whatwhat", "31337");
// console.log(catalog.get("whatwhat"));
// catalog.context("default");
// console.log(catalog.get("whatwhat"));

// catalog.context("procs")

// catalog.set(/i am a regex (.*) with arbitrary (.*) groups in it!/, function(p) { console.log(p, `I enjoy riding the ${p[1]}, but not on the ${p[2]}!`); });
// catalog.set(/i am a regex with no groups in it!/, function() { console.log("I am the function attached to the second regex"); });
// catalog.set("i'm not even a <thing>, bro", function(p) { console.log(`I am the function attached to the third regex, and i just got passed ${p.thing}.`); });



// ({func, args} = catalog.get_call("i am a regex with with with and with with arbitrary whatwhatwhat what what groups in it!"));

// catalog.get_call("i'm not even a marmot, bro");
// ({func, args} = catalog.get_call("i'm not even a marmot, bro"));
// console.log(m)
// console.log(func)
// console.log(args)
// func(args);


// console.log(catalog.get(c));

// splash();
var error = function(token, msg) {
	console.log(chalk.red(`Error at ${token.src}:${token.row}:${token.col}, ${msg}\n`), token);
}


var define = function(stack) {
	if (typeof stack == "object") {
		catalog.context("procs");
		catalog.set(stack[0].data, stack);
	}
}


var execute = function(stack) {
	if (typeof stack == "object") {
		stack.forEach(function(x) {
			// console.log(x.data);
		});
	}
}

var execution_list = [];


var parse = function(lexer) {

	let mode = "NORMAL";
	
	let stack = [];
	let procs = [];

	let token = lexer.next();
	while (token !== undefined) {
		// console.log(token);
		switch (token.type) {
			case "UNKNOWN":
				error(token, `Undefined command: "${token.data}"`)
				return;
			case "SCENARIO":
				execution_list.push(token);
				//fallthru
			case "PROCEDURE":
		  	stack = [];
			  mode = "DEFINE";
			  //fallthru
			case "CALLPROC":
			  stack.push(token);
				break;
			case "ENDBLOCK":
				if (mode == "DEFINE") {
			  	define(stack);
			  	stack = [];
					// console.log("\nTRYING TO DEFINE A FUNCTION", stack);
			  	mode = "NORMAL";
				}
				break;
			case "WHITESPACE":
			case "NEWLINE":
				break;
			default:
				// console.log(token.type, token.data)
				break;
		}
		token = lexer.next();
	}
}


args.forEach(function(val, index) {
	specFiles = files.ls(`${process.cwd()}/${val}`);
	specFile = specFiles.next();
	while (!specFile.done) {
		heading(`Processing ${specFile.value}...`);
		let data = files.read(specFile.value);
		lexer.load(specFile.value, data);

		parse(lexer);

		specFile = specFiles.next();
		console.log();
	}
	catalog.dump();
	execute(execution_list);
	});

