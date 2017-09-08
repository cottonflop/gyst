var { lexer, rule }  = require('bluesocks');
let rules = {
	default: [
		rule("PERIOD", /\./),
		rule("CHARACTER", /./)
	],
	somethingelse: [
		rule("LETTER", /[a-zA-Z]/),
		rule("DIGIT", /[0-9]/),
		rule("PERIOD", /\./),
		rule("OTHER", /./),
	]
}

lex = lexer("Hello, world. This should be read in a different mode. AND THIS SHOULD BE BACK TO DEFAULT!", "test", rules);

let token = lex.next()
while(!token.done) {
	let mode_switch = undefined;
	switch (token.value.mode) {
		case "default":
			switch (token.value.type) {
				case "PERIOD":
					console.log(`[MODE ${token.value.mode}] Found "${token.value.data}" at (${token.value.row}, ${token.value.col})`);
					mode_switch = "somethingelse";
				case "CHARACTER":
					// break;
					console.log(`[MODE ${token.value.mode}] Found "${token.value.data}" at (${token.value.row}, ${token.value.col})`);
					break;
			}
			break;
		case "somethingelse":
			console.log(`[MODE ${token.value.mode}] Found "${token.value.data}" at (${token.value.row}, ${token.value.col})`);
			if (token.value.type == "PERIOD") mode_switch = "default";
			break;
	}
	token = lex.next(mode_switch);
}
