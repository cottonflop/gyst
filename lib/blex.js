/*
* @Author: Betsy Fox
* @Date:   2017-08-21 16:16:03
* @Last Modified by:   Betsy Fox
* @Last Modified time: 2017-08-23 15:40:13
*/

var token = function(type, data, src, row, col) {
	return {
		type: type,
		data: data,
		src: src,
		row: row,
		col: col
	}
}

pos2d = function(s) {
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}

var rule = function(name, regex) {
	return { name: name, regex: regex };
}

var rules = {
	default: [
		rule("ENDBLOCK", /(\n|\r\n){2,}/),
		rule("NEWLINE", /(\n|\r\n){1}/),
		rule("WHITESPACE", /[\r\t ]+/),
		rule("TAG", /@[a-z0-9_.,]+/i),
		rule("FEATURE", /Feature: [^\n]+/i),
		rule("BACKGROUND", /Background: [^\n]+/i),
		rule("SCENARIO", /Scenario: [^\n]+/i),
		rule("PROCEDURE", /Procedure: [^\n]+/i),
		rule("EXAMPLES", /Examples: [^\n]+/i),
		rule("NEEDBLOCK", /(Given|When|Then|And|If|Else|Otherwise) [^\n]+/i),
		rule("UNKNOWN", /\S+/)
	],
	feature : [
		rule("ENDBLOCK", /(\n|\r\n){2,}/),
		rule("EXPOSITION", /.+/),
		rule("NEWLINE", /(\n|\r\n){1}/),
	],
	procedure : [
		rule("ENDBLOCK", /(\n|\r\n){2,}/),
		rule("NEWLINE", /(\n|\r\n){1}/),
		rule("WHITESPACE", /[\r\t ]+/),
		rule("CALLPROC", /(Given|When|Then|And) [^\n]+/i),
		rule("CONDITIONAL", /If [^\n]+/i),
		rule("ELSE", /(Else|Otherwise) [^\n]+/i),
		rule("UNKNOWN", /\S+/)
	]
}


var lexer = function*(s, src, mode = "default") {
	if (Array.isArray(rules)) rules = { default: rules };
	if (s === undefined) return "No string provided!";
	if (src === undefined) return "No source provided!";
	if (rules === undefined) return "No lexical rules provided!";
	let pos = 0;
	let row = 1;
	let col = 1;
	let adv = 1;
	let newmode = undefined;

	for (let i=0; i < s.length; i+=adv) {
		let match = -1;
		let rule = rules[mode].find((x) => (s.substr(i).search(x.regex) == 0));
		let found = rule.regex.exec(s.substr(i));
		if (found == null) {
			console.error("THIS ERROR SHOULD NEVER BE DISPLAYED, BECAUSE THAT WOULD MAKE NO SENSE");
			return;
		}
		[row, col] = pos2d(s.substr(0, i));
		newmode = yield token(rule.name, found[0], src, row, col);
		if (newmode !== undefined) {
			console.log(`################=======> SWITCHING MODE TO "${newmode}" at row ${row}`)
		}
		mode = (newmode !== undefined) ? newmode : mode;
		adv = found[0].length;
	}
}


module.exports = {
	lexer: lexer
}