var Lexer = require("lex");
var files = require('./files.js');


var file = "";
var line = 1;
var char = 1;
 
var lexer = new Lexer;

nl = function(lexeme) { char = 1; line += lexeme.split("\n").length; }
adv = function(lexeme) { char += lexeme.length; }

rules = {
	WHITESPACE : [/[\t ]+/i, adv],
	FEATURE    : [/Feature: [^\n]+/i, adv],
	BACKGROUND : [/Background: [^\n]+/i, adv],
	SCENARIO   : [/Scenario: [^\n]+/i, adv],
	PROCEDURE  : [/Procedure: [^\n]+/i, adv],
	EXAMPLES   : [/Examples: [^\n]+/i, adv],
	STEP       : [/(Given|When|Then|And) [^\n]+/i, adv],
	IF         : [/If [^\n]+/i, adv],
	ELSE       : [/(Else|Otherwise) [^\n]+/i, adv],
	ENDBLOCK   : [/(\n|\r\n){2,}/, nl],
	NEWLINE    : [/(\n|\r\n){1}/, nl]
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
lexer 	.addRule(rules.WHITESPACE[0], function (lexeme) {
					char += lexeme.length;
				})
				.addRule(rules.NEWLINE[0], function (lexeme) {
					line++;
					char = 1;
    			// return `NEWLINE`;
				})
				.addRule(rules.ENDBLOCK[0], function (lexeme) {
					char = 1;
					line += lexeme.split("\n").length;
    			return `END BLOCK`;
				})
				.addRule(rules.SCENARIO[0], function (lexeme) {
					char += lexeme.length;
    			return `SCENARIO: "${lexeme}"`;
				})
				.addRule(rules.PROCEDURE[0], function (lexeme) {
					char += lexeme.length;
    			return `PROCEDURE: "${lexeme}"`;
				})
				.addRule(rules.STEP[0], function (lexeme) {
					char += lexeme.length;
    			return `STEP: "${lexeme}"`;
				})
				.addRule(rules.ELSE[0], function (lexeme) {
					char += lexeme.length;
    			return `ELSE: "${lexeme}"`;
				})
				.addRule(rules.IF[0], function (lexeme) {
					char += lexeme.length;
    			return `IF: "${lexeme}"`;
				})
}


load = function(s) {
	lexer = new Lexer;
	loadRules();
	lexer.input = files.read(s) + "\n\n\n\n\n\n";
}

load("./specs/test.specs");

try {
	var output = lexer.lex()
	while (output !== undefined) {
		console.log(line, char, output);
		output = lexer.lex();
	}
} catch(err) {
	console.log(`${err} at (/specs/test.specs:${line}:${char})`)
}

// module.exports = {
// 	load: load,
//   next: next

//   // parse : parse
// }