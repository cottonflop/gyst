let context = require('./context_test');


// function fnord() {
// 	unexposed_function();
// 	console.log(what);
// }

// fnord.call(context);

function what() {
	undefinedfunction();
}

context.eat_function("fnord", (function(){console.log("hello")}));
context.eat_function("whatwhat", what.toString());

context.context["whatwhat"]()
// context.what();