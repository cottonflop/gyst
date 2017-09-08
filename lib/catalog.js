module.exports = function(store) {
  let step_defs = store;

  let get_step_def = function(step) {
    let keys = step_defs.keys();
    let step="", args=[];
    key = keys.next();
    while (!key.done) {
      let simple = ;
      if (is_simple(key.value)) {
        step = to_regex(key.value);
        args = simple_params(key.value, procname);
      } else {
        step = key.value;
        args = params(step, procname);
      }
      let r = new RegExp(step);
      if (r.test(procname)) {
        return {
          func: step_defs.get(step),
          args: args
        };
        break;
      } else {
        key = keys.next();
      }
    }
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


  let params = function(regex, haystack) {
    let r = new RegExp(regex);
    return r.exec(haystack);
  };


  let dump = function() {
    let keys = step_defs.keys();
    let key = keys.next();
    console.log(`======= DUMPING STEP DEFS =======`);
    while (!key.done) {
      console.log(key.value, step_defs.get(key.value));
      key = keys.next();
    }
    context(last_context);
  };


  let exists = function(key) {
    if (typeof key == "object") key = key.source;
    return step_defs.has(key);
  };


  return {
    exists: exists,
    dump: dump,
    get: get,
    set: set,
    get_call: get_call,
    params: params,
    context: context,
    current_context: current_context,
    step_defs: step_defs,
  };
};