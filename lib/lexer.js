var Lexer = require("lex");
var files = require('./files.js');


var src = "";
var row = 1;
var col = 1;

var lexer = new Lexer;


var token = function(type, data) {
	return {
		type: type,
		data: data,
		src: src,
		col: col,
		row: row
	}
}


eat_kw = function(s) {
	return s.substr(s.indexOf(" ") + 1);
}


rules = {
	TAG  				: [/@[a-z0-9_.,]+/i, 	              (lexeme) => { return token("TAG", lexeme) }],
	WHITESPACE  : [/[\t ]+/i,                       (lexeme) => { return token("WHITESPACE", lexeme) }],
	ENDBLOCK    : [/(\n|\r\n){2,}/,                 (lexeme) => { return token("ENDBLOCK", lexeme) }],
	NEWLINE     : [/(\n|\r\n){1}/,                  (lexeme) => { return token("NEWLINE", lexeme) }],
	FEATURE     : [/Feature: [^\n]+/i,              (lexeme) => { return token("FEATURE", eat_kw(lexeme)) }],
	BACKGROUND  : [/Background: [^\n]+/i,           (lexeme) => { return token("BACKGROUND", eat_kw(lexeme)) }],
	SCENARIO    : [/Scenario: [^\n]+/i,             (lexeme) => { return token("SCENARIO", eat_kw(lexeme)) }],
	PROCEDURE   : [/Procedure: [^\n]+/i,            (lexeme) => { return token("PROCEDURE", eat_kw(lexeme)) }],
	EXAMPLES    : [/Examples: [^\n]+/i,             (lexeme) => { return token("EXAMPLES", eat_kw(lexeme)) }],
	STEP        : [/(Given|When|Then|And) [^\n]+/i, (lexeme) => { return token("CALLPROC", eat_kw(lexeme)) }],
	CONDITIONAL : [/If [^\n]+/i,                    (lexeme) => { return token("CONDITIONAL", eat_kw(lexeme)) }],
	ELSE        : [/(Else|Otherwise) [^\n]+/i,      (lexeme) => { return token("ELSE", eat_kw(lexeme)) }],
	UNKNOWN			: [/\S+/,                           (lexeme) => { return token("UNKNOWN", lexeme) }],
}


loadRules = function() {
	// lexer.addRule(rules.WHITESPACE)
	for(var rule in rules) {
		// console.log(`Adding rule "${rule}" with regex "${rules[rule][0]}"`)
		lexer.addRule(...rules[rule]);
	}
}


position = function(s, index) {
	index = (index === undefined) ? 0 : index;
	s = s.substr(0, index);
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}


load = function(srcname, data) {
	src = srcname;
	lexer = new Lexer;
	loadRules();
	lexer.input = data; //files.read(s) + "\n\n\n\n\n\n";
}


next = function() {
	try {
		let n = lexer.lex();
		[row, col] = position(lexer.input, lexer.index);
		return n;
	} catch(err) {
		console.log(`${err} at (${src}:${row}:${col})`)
	}
}

module.exports = {
	load: load,
  next: next
}