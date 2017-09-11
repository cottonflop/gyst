var step_defs = new Map();
var data = new Map();

var find_step_def = function(token) {
	
}


//called before all tests
var before = function() {
	//TODO: write prereq stuff
	console.log("called setup stuff");
}


//called after all tests
var after = function() {
	//TODO: write post stuff
	console.log("called post cleanup stuff");
}


module.exports = {
	step_defs: step_defs,
	pre: pre,
	post: post,
}