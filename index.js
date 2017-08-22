#!/usr/bin/env node

var chalk       = require('chalk');
var clear       = require('clear');
// var cli         = require('cli');
var figlet      = require('figlet');
var fs          = require('fs');
var files       = require('./lib/files.js');
// var catalog   = require('./lib/catalog.js')

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
	chalk.blue(" version " + require('./package.json').version)
);

var procs = new Map();
var call_proc = function(token) {
	let proc_names = procs.keys();
	let proc_name = proc_names.next();
	while(!proc_name.done) {
		
	}
}


var error = function(token, msg) {
	console.log(chalk.red(`Error at ${token.src}:${token.row}:${token.col}, ${msg}\n`));
}


var execute = function(callstack) {
	if (typeof callstack == "object") {
		callstack.forEach(function(x) {
			if (typeof x == "function") {
				x
			}
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
	let proc_name = (name.data === undefined) ? name : name.data;
	let t = lexer.next("procedure");
	let token = t.value;
	let stack = [];
	while (!token.type == "ENDBLOCK" && !t.done) {
		switch(token.type) {
			case "UNKNOWN":
				error(token, `Unexpected token: "${token.data}"`);
				return false;
			case "CALLPROC":
			  stack.push(token);
				break;
			case "ENDBLOCK":
				break;
			}
		}
	}


var parse = function(lexer) {
	let t = lexer.next();
	while (!t.done) {
		token = t.value;
		switch (token.type) {
			case "UNKNOWN":
				console.log("IT'S AN UNKNOWN TOKEN, BRO");
				error(token, `Undefined command: "${token.data}"`)
				return false;
			case "FEATURE":
				// console.log("IT'S A FEATURE, BRO");
				parse_feature(lexer);
				break;
			case "SCENARIO":
				// console.log("IT'S A SCENARIO, BRO");
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

