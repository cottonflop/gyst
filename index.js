#!/usr/bin/env node

var chalk = require('chalk');
var clear = require('clear');
// var cli         = require('cli');
var figlet = require('figlet');
var fs = require('fs');
var files = require('./lib/files.js');
// var catalog   = require('./lib/catalog.js')

var {	lexer } = require('bluesocks');
var rules = require('./lib/rules');
var { heading, log } = require('./lib/common.js')

// var { procs, pre, post }

args = process.argv;
args.shift();
args.shift();



var execution_list = [];

splash = function() {
	clear();
	console.log(
		chalk.green(figlet.textSync('Gyst', {
			font: "doom",
			horizontalLayout: 'default'
		})),
		"\n",
		chalk.blue(" version " + require('./package.json').version)
	);
}


var procs = new Map();
var call_proc = function(token) {
	let proc_names = procs.keys();
	let proc_name = proc_names.next();
	while (!proc_name.done) {}
}


var error = function(token, msg) {
	console.log(chalk.red(`Error at ${token.value.src}:${token.value.row}:${token.value.col}, ${msg}\n`));
}


var execute = function(callstack) {
	switch (typeof callstack) {
		case "object":
			callstack.forEach(function(x) {
				console.log(`EXECUTING ${x.data} FROM ${x.src}:${x.row}:${x.col}`);
				if (x.type == 'CALLPROC') execute(x.data);
				else execute(procs.get(x.data));
			});
			break;
		case "string":
			execute(procs.get(callstack));
			break;
		case "function":
			console.log(callstack);
		default:
			// console.log(`We hit something that wasn't a string or an object/array- typeof is "${typeof callstack}" and the value is "${callstack}"`);
			break;
	}
	// if (typeof callstack == "object") {
	// 	callstack.forEach(function(x) {
	// 		 console.log("EXECUTING", x.data);
	// 		if (x.type == 'CALLPROC')
	// 			execute(x.data);
	// 		// console.log(procs.get(x.data));
	// 	});
	// } else {
	// 	// console.log(procs.get(x.data));
	// }
}


var parse_feature = function(lexer) {
	let token = lexer.next();
	while (!token.done && token.value.type != "ENDBLOCK") {
		token = lexer.next();
	}
}


var parse_procedure = function(lexer) {
	let token = lexer.next();
	let stack = [];
	while (!token.done && token.value.type != "ENDBLOCK") {
		switch (token.value.type) {
			case "CALLPROC":
				stack.push(token.value);
				break;
			case "NATIVE":
				stack.push(parse_native(lexer));
				break;
			case "UNKNOWN":
				error(token, `Unexpected token: "${token.value.data}"`);
				return false;
		}
		token = lexer.next();
	}
	return stack;
}


var parse_native = function(lexer) {
	let token = lexer.next();
	while (!token.done && token.value.type != "ENDBLOCK") {
		console.log(`"${token.value.data}"`);
		// eval();
		token = lexer.next();
	}
	lexer.next("procedure");
	return "";
}


var eat_keyword = function(s) {
	return s.substr(s.search(" ") + 1);
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
		if (specFile.value.toLowerCase().endsWith(".specs")) {
			heading(`Processing ${specFile.value}...`);
			let data = files.read(specFile.value);
			lex = lexer(data, specFile.value, rules);
			parse(lex);
		}
		specFile = specFiles.next();
	}

	let keys = procs.keys();
	let key = keys.next();

	execute(execution_list);
});