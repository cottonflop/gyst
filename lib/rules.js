var { rule }   = require('bluesocks');

const ENDBLOCK = rule("ENDBLOCK", /(\n|\r\n){2,}/, "<");
const NEWLINE = rule("NEWLINE", /(\n|\r\n){1}/);
const WHITESPACE = rule("WHITESPACE", /[\r\t ]+/);

module.exports = {
	default: [
		ENDBLOCK,
		NEWLINE,
		WHITESPACE,
		rule("TAG", /@[a-z0-9_.,]+/i), //TODO: handle tags
		rule("FEATURE", /Feature:[^\n]+/i, "feature"),
		rule("BACKGROUND", /Background:[^\n]+/i), //TODO: handle background (prereqs)
		rule("SCENARIO", /Scenario:[^\n]+/i, "procedure"),
		rule("PROCEDURE", /Procedure:[^\n]+/i, "procedure"),
		rule("EXAMPLES", /Examples:[^\n]+/i, "table"),
		rule("NEEDBLOCK", /(Given|When|Then|And|If|Else|Otherwise) [^\n]+/i),
		rule("UNKNOWN", /\S+/)
	],
	feature: [
		ENDBLOCK,
		rule("EXPOSITION", /.+/),
		rule("NEWLINE", /(\n|\r\n){1}/),
	],
	table: [
		ENDBLOCK,
		rule("NEWLINE", /(\n|\r\n){1}/),
		rule("ROW", /\s*\|\s*/, "row"),
	],
	row: [
		ENDBLOCK,
		rule("NEWLINE", /(\n|\r\n){1}/, "<"),
		rule("CELL", /\S+/),
		rule("ENDCELL", /\s*\|\s*/),
	],
	procedure: [
		rule("ENDBLOCK", /(\n|\r\n){2,}/, "<"),
		rule("NEWLINE", /(\n|\r\n){1}/),
		rule("NATIVE", /#{/, "native"),
		rule("WHITESPACE", /[\r\t ]+/),
		rule("CALLPROC", /(Given|When|Then|And) [^\n]+/i),
		rule("CONDITIONAL", /If [^\n]+/i),
		rule("ELSE", /(Else|Otherwise) [^\n]+/i),
		rule("UNKNOWN", /\S+/),
	],
	native: [
		rule("ENDBLOCK", /}#/, "<"),
		rule("CODE", /(?:(?!}#).)+/),
		// rule("NEWLINE", /(\n|\r\n){1}/),
	]
}