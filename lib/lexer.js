var Lexer = require("lex");
var files = require('./files.js');


var file = "";
var line = 1;
var char = 1;

var lexer = new Lexer;

nl = function(lexeme) { char = 1; line += lexeme.split("\n").length; }
adv = function(lexeme) { char += lexeme.length; }

rules = {
	WHITESPACE : /[\t ]+/i,
	FEATURE    : /Feature: [^\n]+/i,
	BACKGROUND : /Background: [^\n]+/i,
	SCENARIO   : /Scenario: [^\n]+/i,
	PROCEDURE  : /Procedure: [^\n]+/i,
	EXAMPLES   : /Examples: [^\n]+/i,
	STEP       : /(Given|When|Then|And) [^\n]+/i,
	IF         : /If [^\n]+/i,
	ELSE       : /(Else|Otherwise) [^\n]+/i,
	ENDBLOCK   : /(\n|\r\n){2,}/,
	NEWLINE    : /(\n|\r\n){1}/
}

// loadRules = function() {
// 	lexer.addRule(rules.WHITESPACE)
	// for(var rule in rules) {
	// 	console.log(`Adding rule "${rule}" with regex "${rules[rule][0]}"`)
	// 	lexer.addRule(rules[rule][0], function(lexeme) {
	// 		rules[rule][1](lexeme);
	// 		return `${rule}: "${lexeme}"`;
	// 	});
	// }
// }

loadRules = function() {
lexer 	.addRule(rules.WHITESPACE, function (lexeme) {
					char += lexeme.length;
				})
				.addRule(rules.NEWLINE, function (lexeme) {
					line++;
					char = 1;
    			// return `NEWLINE`;
				})
				.addRule(rules.ENDBLOCK, function (lexeme) {
					char = 1;
					line += lexeme.split("\n").length;
    			return `END BLOCK`;
				})
				.addRule(rules.SCENARIO, function (lexeme) {
					char += lexeme.length;
    			return `SCENARIO: "${lexeme}"`;
				})
				.addRule(rules.PROCEDURE, function (lexeme) {
					char += lexeme.length;
    			return `PROCEDURE: "${lexeme}"`;
				})
				.addRule(rules.STEP, function (lexeme) {
					char += lexeme.length;
    			return `STEP: "${lexeme}"`;
				})
				.addRule(rules.ELSE, function (lexeme) {
					char += lexeme.length;
    			return `ELSE: "${lexeme}"`;
				})
				.addRule(rules.IF, function (lexeme) {
					char += lexeme.length;
    			return `IF: "${lexeme}"`;
				})
}


load = function(s) {
	file = s;
	lexer = new Lexer;
	loadRules();
	lexer.input = files.read(s) + "\n\n\n\n\n\n";
}

// load("./specs/test.specs");

// try {
// 	var output = lexer.lex()
// 	while (output !== undefined) {
// 		console.log(line, char, output);
// 		output = lexer.lex();
// 	}
// } catch(err) {
// 	console.log(`${err} at (/specs/test.specs:${line}:${char})`)
// }

next = function() {
	try {
		return lexer.lex();
	} catch(err) {
		console.log(`${err} at (${file}:${line}:${char})`)
	}
}

module.exports = {
	line: line,
	char: char,

	load: load,
  next: next
}