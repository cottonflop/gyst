var { rule }   = require('bluesocks');

const ENDBLOCK = rule("ENDBLOCK", /\s*(\n|\r\n){2,}\s*/, "<");
const NEWLINE = rule("NEWLINE", /\s*(\n|\r\n){1}\s*/);
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
		rule("NEWLINE", /\s*(\n|\r\n){1}\s/),
		rule("ROW", /\s*|\s+/, "row"),
	],
	row: [
		rule("NEWLINE",     /(\n|\r\n){1}/, "<"),
		rule("DATA",        /[^|\n]*[^|\n\s]+[^|\n]*/),
		rule("CELLDIVIDER", /\|/),
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