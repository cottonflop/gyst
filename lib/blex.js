var token = function(type, data, src, col, row) {
	return {
		type: type,
		data: data,
		src: src,
		col: col,
		row: row
	}
}

pos2d = function(s) {
	index = (index === undefined) ? 0 : index;
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}

var rule = function(name, regex) return { name: name, regex: regex };

rules = {
	default: [
		rule("NEWLINE", /(\n|\r\n){1}/),
		rule("WHITESPACE", /[\r\t ]+/),
		rule("ENDBLOCK", /(\n|\r\n){2,}/),
		rule("TAG", /@[a-z0-9_.,]+/i),
		rule("FEATURE", /Feature: [^\n]+/i),
		rule("BACKGROUND", /Background: [^\n]+/i),
		rule("SCENARIO", /Scenario: [^\n]+/i),
		rule("PROCEDURE", /Procedure: [^\n]+/i),
		rule("EXAMPLES", /Examples: [^\n]+/i),
		rule("STEP", /(Given|When|Then|And) [^\n]+/i),
		rule("CONDITIONAL", /If [^\n]+/i),
		rule("ELSE", /(Else|Otherwise) [^\n]+/i),
		rule("UNKNOWN", /\S+/)
	],

	words: [
		rule("END", /end/i),
		rule("NEWLINE", /(\n|\r\n){1}/),
		rule("WHITESPACE", /[\r\t ]+/),
		rule("WORD", /.+/)
	]
}

var lex = function*(s, src, rules, mode="default") {
	if (rules.isArray()) rules = { default: rules };
	(s === undefined) ? return "No string provided!";
	(src === undefined) ? return "No source provided!";
	(rules === undefined) ? return "No lexical rules provided!";
	let mode = "default";
	let pos = 0;
	let row = 1;
	let col = 1;
	let adv = 1;

	for (let i=0; i < s.length; i+=adv) {
		let match = -1;
		let rule = rules[mode].find((x) => (s.substr(i).search(x.regex) == 0));
		let found = rule.exec(s.substr(i));

		newmode = yield found[0];
		mode = newmode ? newmode : mode;
	}
}







