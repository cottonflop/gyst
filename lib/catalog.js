let current_context = "default";

let catalog = new Map();


//TODO: we assume object keys are regex, but maybe this might need to get broken later
//      look into better ways of detecting if this is actually a regex object
//TODO: consider whether converting context over to a push/pop stack would be terrible?
let context = function(key) {
  let last_context = current_context;
  key = (typeof key == "object") ? key.data : key;
  current_context = key;
  if (!catalog.has(key)) {
    catalog.set(key, new Map());
  }
  return last_context;
};
let last_context = context("procs");
console.log(current_context);
context(last_context);
console.log(current_context);


let get_call = function(keyhole) {
  let keys = catalog.get(current_context).keys();
  let step = "";
  let args = [];
  let out = false;
  key = keys.next();
  while(!key.done) {
    let simple = is_simple(key.value);
    if (simple) {
      step = to_regex(key.value);
      args = simple_params(key.value, keyhole);
    } else {
      step = key.value;
      args = params(step, keyhole);
    }
    let r = new RegExp(step);
    if (r.test(keyhole)) {
      out = { func: catalog.get(current_context).get(step), args: args };
      break;
    } else {
      key = keys.next();
    }
  }
  return out;
};


let is_simple = function(text) {
  re = /(?:<)\w+(?:>)/g;
  return re.test(text);
};


let to_regex = function(not_regex) {
  return not_regex.replace(/<\w+>/g, "(.*)");
};


//TODO: generate two arrays, one of keys and one of values and munge into an object
//TODO: refactor stuff so that all args are objects
let simple_params = function(not_regex, haystack) {
  let s = "";
  let keys = [];
  let values = [];
  re = /(?:<)\w+(?:>)/g;
  while (s = re.exec(not_regex)) {
    s = s[0].replace(/[<>]/g, "");
    keys.push(s);
  }
  return [not_regex.replace(/<\w+>/g, "(.*)")].concat(keys);
};


let params = function (regex, haystack) {
  let r = new RegExp(regex);
  return r.exec(haystack);
  // let out = [];
  // let i = 0;
  // while (m !== null && m[i] !== undefined) {
  //   out.push(m[i++]);
  // }
  // return [regex].concat(out);
};


let get = function(key) {
  if (typeof key == "object") key = key.toString();
  return catalog.get(current_context).get(key);
};


let set = function(key, value) {
  if (typeof key == "object") key = key.src;
  if (exists(key)) return false;
  catalog.get(current_context).set(key, value);
  return true;
};


let dump = function(context="default") {
  if (catalog.get(context) === undefined) {
    console.log(`Context ${context} is not defined!`)
    return;
  }
  let last_context = context(context);
  let keys = catalog.get(current_context).keys();
  let key = keys.next();
  console.log(`======= DUMPING ${current_context}`);
  while(!key.done) {
    console.log(key.value, catalog.get(current_context).get(key.value));
    key = keys.next();
  }
  context(last_context);
};


let exists = function(key) {
  if (typeof key == "object") key = key.source;
  return catalog.get(current_context).has(key);
};


module.exports = {
  exists: exists,
  dump: dump,
  get: get,
  set: set,
  get_call: get_call,
  params: params,
  context: context,
  current_context: current_context,
  catalog: catalog
};