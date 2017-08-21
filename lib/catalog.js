//catalog

let current_context = "default";

let catalog = new Map();


var context = function(key, preprocessor) {
	//TODO: we assume object keys are regex, but maybe this might need to get broken later
	//look into better ways of detecting if this is actually a regex object
	if (typeof key == 'object') key = key.source;
	current_context = key;
	if (!catalog.has(key))
		catalog.set(key, new Map());
}


var get_call = function(keyhole) {
	let keys = catalog.get(current_context).keys();
	let step = "";
	let args = [];
	key = keys.next();
	while(!key.done) {
		let simple = is_simple(key.value);
		if (simple) {
			// console.log("============= CHECKING A SIMPLE STEP DEF!");
			step = to_regex(key.value);
			args = simple_params(key.value, keyhole);
		} else {
			step = key.value;
			args = params(step, keyhole);
		}
		let r = new RegExp(step);
		// console.log(`Testing ${r.toString()} against "${keyhole}"...`)
		if (r.test(keyhole)) {
			// console.log(step, keyhole);
			return {
				func: catalog.get(current_context).get(step),
				args: args
			}
		}	else key = keys.next();
	}
}


var is_simple = function(text) {
	re = /(?:<)\w+(?:>)/g;
	return re.test(text);
}


var to_regex = function(not_regex) {
	return not_regex.replace(/<\w+>/g, "(.*)");
}


//TODO: generate two arrays, one of keys and one of values and munge into an object
//TODO: refactor stuff so that all args are objects
var simple_params = function(not_regex, haystack) {
  let s = "";
  let keys = [];
  let values = [];
  re = /(?:<)\w+(?:>)/g;
  while (s = re.exec(not_regex)) {
    s = s[0].replace(/[<>]/g, "");
    keys.push(s);
  }
  return [not_regex.replace(/<\w+>/g, "(.*)")].concat(keys);
}

// console.log(simple_params("i am a <thing> and i enjoy <otherthing>."));

var params = function (regex, haystack) {
	let r = new RegExp(regex);
	return r.exec(haystack);
	// let out = [];
	// let i = 0;
	// while (m !== null && m[i] !== undefined) {
	// 	out.push(m[i++]);
	// }
	// return [regex].concat(out);
}

// console.log(params("i enjoy (.*) and (.*) or (.*)", "i enjoy stuff and things or other things who even knows"));


var get = function(key) {
	if (typeof key == 'object') key = key.toString();
	return catalog.get(current_context).get(key);
}


var set = function(key, value) {
	if (typeof key == 'object') key = key.src;
	if (exists(key)) return false;
	catalog.get(current_context).set(key, value);
	return true;
}


var dump = function() {
	if (catalog.get(current_context) === undefined) return;
	let keys = catalog.get(current_context).keys();
	let key = keys.next();
	console.log(`======= DUMPING ${current_context}`);
	while(!key.done) {
		
		console.log(key.value, catalog.get(current_context).get(key.value));
		key = keys.next();
	}
}


var exists = function(key) {
	if (typeof key == 'object') key = key.source;
	return catalog.get(current_context).has(key);
}


module.exports = {
  exists: exists,
  dump: dump,
  get: get,
  set: set,
  get_call: get_call,
  params: params,
  context: context
}