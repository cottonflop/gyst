var Lexer = require("lex");
var files = require('./files.js');


var src = "";
var row = 1;
var col = 1;

var lexer = new Lexer;


var token = function(type, src, row, col, data) {
	return {
		type: type,
		data: data,
		src: src,
		col: col,
		row: row
	}
}

var nl = function(lexeme) { col = 1; row += lexeme.split("\n").length; return lexeme }
var adv = function(lexeme) { col += lexeme.length; return lexeme }

rules = {
	WHITESPACE  : [/[\t ]+/i,                       (lexeme) => { return token("WHITESPACE", src, row, col, adv(lexeme)) }],
	ENDBLOCK    : [/(\n|\r\n){2,}/,                 (lexeme) => { return token("ENDBLOCK", src, row, col, nl(lexeme)) }],
	NEWLINE     : [/(\n|\r\n){1}/,                  (lexeme) => { return token("NEWLINE", src, row, col, nl(lexeme)) }],
	FEATURE     : [/Feature: [^\n]+/i,              (lexeme) => { return token("FEATURE", src, row, col, adv(lexeme)) }],
	BACKGROUND  : [/Background: [^\n]+/i,           (lexeme) => { return token("BACKGROUND", src, row, col, adv(lexeme)) }],
	SCENARIO    : [/Scenario: [^\n]+/i,             (lexeme) => { return token("SCENARIO", src, row, col, adv(lexeme)) }],
	PROCEDURE   : [/Procedure: [^\n]+/i,            (lexeme) => { return token("PROCEDURE", src, row, col, adv(lexeme)) }],
	EXAMPLES    : [/Examples: [^\n]+/i,             (lexeme) => { return token("EXAMPLES", src, row, col, adv(lexeme)) }],
	STEP        : [/(Given|When|Then|And) [^\n]+/i, (lexeme) => { return token("PROCCALL", src, row, col, adv(lexeme)) }],
	CONDITIONAL : [/If [^\n]+/i,                    (lexeme) => { return token("CONDITIONAL", src, row, col, adv(lexeme)) }],
	ELSE        : [/(Else|Otherwise) [^\n]+/i,      (lexeme) => { return token("ENDBLOCK", src, row, col, adv(lexeme)) }],
	UNKNOWN			: [/./,															(lexeme) => { return token("UNKNOWN", src, row, col, adv(lexeme)) }],
}


loadRules = function() {
	// lexer.addRule(rules.WHITESPACE)
	for(var rule in rules) {
		// console.log(`Adding rule "${rule}" with regex "${rules[rule][0]}"`)
		lexer.addRule(...rules[rule]);
	}
}


load = function(srcname, data) {
	src = srcname;
	lexer = new Lexer;
	loadRules();
	lexer.input = data; //files.read(s) + "\n\n\n\n\n\n";
}


next = function() {
	try {
		return lexer.lex();
	} catch(err) {
		console.log(`${err} at (${src}:${row}:${col})`)
	}
}

module.exports = {
	load: load,
  next: next
}