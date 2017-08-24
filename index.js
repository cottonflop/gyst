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
			console.log(x);
		});
	}
}


var parse_feature = function(lexer) {
	let token = lexer.next("feature");
	while (!token.done && token.value.type != "ENDBLOCK") {
		token = lexer.next();
	}
}


var parse_procedure = function(lexer) {
	let token = lexer.next("procedure");
	let stack = [];
	while (!token.done && token.value.type != "ENDBLOCK") {
		switch(token.value.type) {
			case "CALLPROC":
			  stack.push(token.value);
				break;
			case "UNKNOWN":
				error(token, `Unexpected token: "${token.value.data}"`);
				return false;
			}
		token = lexer.next();
		}
		return stack;
	}


var parse = function(lexer) {
	let token = lexer.next();
	while (!token.done) {
		switch (token.value.type) {
			case "UNKNOWN":
				error(token, `Undefined command: "${token.value.data}"`)
				return false;
			case "FEATURE":
				parse_feature(lexer);
				break;
			case "SCENARIO":
				execution_list.push(token.value);
			case "PROCEDURE":
				procs.set(token.value.data, parse_procedure(lexer));
				break;
			case "WHITESPACE":
			case "NEWLINE":
				break;
			default:
				break;
		}
		token = lexer.next("default");
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

  let keys = procs.keys();
  let key = keys.next();
  // console.log(procs);
  // while(!key.done) {
  // 	console.log("==========================");
  //   console.log(key.value, procs.get(key.value));
  //   key = keys.next();
  // }

	execute(execution_list);
	});

