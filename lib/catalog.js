//catalog

let current_context = "default";

let catalog = new Map();

var context = function(key) {
	current_context = key;
	if (!catalog.has(key))
		catalog.set(key, new Map());
}

var get = function(key) {
	return catalog.get(current_context).get(key);
}


var set = function(key, value) {
	catalog.get(current_context).set(key, value);
}


var exists = function(key) {
	return catalog.get(current_context).has(key);
}


module.exports = {
  exists: exists,
  get: get,
  set : set,
  context: context
}