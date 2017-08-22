#!/usr/bin/env node

var chalk       = require('chalk');
var clear       = require('clear');
// var cli         = require('cli');
var figlet      = require('figlet');
var fs          = require('fs');
var files       = require('./lib/files.js');
var catalog   = require('./lib/catalog.js')

var { lexer }   = require('./lib/blex.js');
var { heading, log } = require('./lib/common.js')

args = process.argv;
args.shift();
args.shift();

var execution_list = [];

clear();
console.log(
	chalk.green(figlet.textSync('Gyst', { font: "doom", horizontalLayout: 'default' })),
	"\n",
	chalk.blue("😱 version " + require('./package.json').version)
);



var register_proc = function(name, callstack) {
	let last_context = catalog.current_context;
	catalog.context("procs");
	catalog.set(name, callstack);
	catalog.context(last_context);
}


var error = function(token, msg) {
	console.log(chalk.red(`Error at ${token.src}:${token.row}:${token.col}, ${msg}\n`));
}


var execute = function(stack) {
	if (typeof stack == "object") {
		stack.forEach(function(x) {
			// console.log(x.data);
		});
	}
}





var parse_feature = function(lexer) {
	let t = lexer.next("feature");
	let token = t.value;
	while (token.type != "ENDBLOCK" && !t.done) {
		token = t.value;
		t = lexer.next();
	}
}

var parse_procedure = function(name, lexer) {
	console.log(`WE'RE PARSING ${name.data}, BRO`);
	console.log(name);

	let proc_name = (name.data === undefined) ? name : name.data;

	let t = lexer.next("procedure");
	let token = t.value;
	let stack = [];
	while (!token.type == "ENDBLOCK" && !t.done) {
		switch(token.type) {
			case "UNKNOWN":
				error(token, `Undefined command: "${token.data}"`);
				return false;
			case "CALLPROC":
				console.log(`IT'S A CALLPROC NAMED ${token.name}, BRO`);
			  stack.push(token);
				break;
			case "ENDBLOCK":
				return stack;
			}
		}
	register_proc(proc_name);

	}

var parse = function(lexer) {
	let procs = [];

	let t = lexer.next();
	while (!t.done) {
		token = t.value;
		switch (token.type) {
			case "UNKNOWN":
				console.log("IT'S AN UNKNOWN TOKEN, BRO");
				error(token, `Undefined command: "${token.data}"`)
				return false;
			case "FEATURE":
				console.log("IT'S A FEATURE, BRO");
				parse_feature(lexer);
				break;
			case "SCENARIO":
				console.log("IT'S A SCENARIO, BRO");
				execution_list.push(token);
				//fallthru
			case "PROCEDURE":
				console.log("IT'S A PROCEDURE, BRO");
				parse_procedure(token, lexer);
				break;
			case "WHITESPACE":
			case "NEWLINE":
				break;
			default:
				// console.log(token.type, token.data)
				break;
		}
		// console.log(token);
		t = lexer.next("default");
	}
}


args.forEach(function(val, index) {
	specFiles = files.ls(`${process.cwd()}/${val}`);
	specFile = specFiles.next();
	while (!specFile.done) {
		heading(`Processing ${specFile.value}...`);
		let data = files.read(specFile.value);
		// lexer.load(specFile.value, data);
		lex = lexer(data, specFile.value)
		parse(lex);

		specFile = specFiles.next();
	}
	// console.log(catalog);
	// catalog.dump("procs");
	catalog.context("procs");
	console.log(catalog.current_context);
  let keys = catalog.catalog.get(catalog.current_context).keys();
  let key = keys.next();
  console.log(`======= DUMPING ${catalog.current_context}`);
  while(!key.done) {
    console.log(key.value, catalog.catalog.get(catalog.current_context).get(key.value));
    key = keys.next();
  }

	execute(execution_list);
	});

