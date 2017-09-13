var { lexer, rule } = require('bluesocks');

let rules = require('./rules.js');

lex = lexer("Scenario: adsfsdfds", "test", rules);

let token = lex.next();
while(!token.done) {
	console.log(token.value.data);
	token = lex.next();
}
