let context = {};
// context.a = "I was set INSIDE the require context.";
// console.log(`Context at start of import is: "${context.a}"`);

// nested_function = function(fnord) {
// 	console.log(`Context inside nested function of import is: "${context.a}"`)
// 	context.a = fnord;
// 	if (context.hasOwnProperty("b")) context.b.call(this);
// }


// let what = "321";
// let unexposed_function = function() {
// 	console.log("Can I be called from a bound function? YOU BET YOUR COTTON SOCKS I CAN.");
// }


eat_function = function(name, s) {
	context[name] = eval(`(${s.toString()})`);
}

let undefinedfunction = function() {console.log("HA.")}
// context.b = eat_function(unexposed_function);

module.exports = {
		context: context,
		// nested_function: nested_function,
		eat_function: eat_function,
}