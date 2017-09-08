var procs = new Map();
var call_proc = function(token) {
	let proc_names = procs.keys();
	let proc_name = proc_names.next();
	while (!proc_name.done) {}
}


var pre = function() {
	//TODO: write prereq stuff
	console.log("called setup stuff");
}


var post = function() {
	//TODO: write post stuff
	console.log("called post cleanup stuff");
}


var import_procs = function(in_procs) {
	if (Array.isArray(in_procs)) {

	} else if (Object)
}

module.exports = {
	procs: procs,
	pre: pre,
	post: post,
	procs: fnord
}