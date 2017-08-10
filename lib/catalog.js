//catalog

let current_context = "default";

let catalog = new Map();


var context = function(key) {
	//TODO: we assume object keys are regex, but maybe this might need to get broken later
	//look into better ways of detecting if this is actually a regex object
	if (typeof key == 'object') key = key.source;
	current_context = key;
	if (!catalog.has(key))
		catalog.set(key, new Map());
}


var get_call = function(keyhole) {
	let keys = catalog.get(current_context).keys();
	key = keys.next();
	while(!key.done) {
		let r = new RegExp(key.value);
		console.log(`Testing ${r.toString()} against "${keyhole}"...`)
		if (r.test(keyhole)) {
			return {
				func: catalog.get(current_context).get(key.value),
				args: params(key.value, keyhole)
			}
		}
		else key = keys.next();
	}
}


var set_call = function(key, value) {

}


var process_vars = function(text) {
  var s = "";
  out = [];
  re = /(?:<)\w+(?:>)/g;
  while (s = re.exec(text)) {
    s = s[0].replace(/[<>]/g, "");
    out.push(s);
  }
  return [text.replace(/<\w+>/g, "(.*)")].concat(out);
}


var params = function (regex, haystack) {
	let r = new RegExp(regex);
	let m = r.exec(haystack);
	let out = [];
	let i = 0;
	while (m[i] !== undefined) {
		out.push(m[i++]);
	}
	return out;
}


var get = function(key) {
	if (typeof key == 'object') key = key.toString();
	return catalog.get(current_context).get(key);
}


var set = function(key, value) {
	if (typeof key == 'object') key = key.source;
	if (exists(key)) return false;
	catalog.get(current_context).set(key, value);
	return true;
}


var exists = function(key) {
	if (typeof key == 'object') key = key.source;
	return catalog.get(current_context).has(key);
}


module.exports = {
  exists: exists,
  get: get,
  set: set,
  get_call: get_call,
  params: params,
  context: context
}