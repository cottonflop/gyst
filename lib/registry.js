module.exports = function(registry) {
  registry = registry || new Map();


  let register = function(name, func, overwrite = false) {
    if (name instanceof RegExp) name = name.source;
    if (!registry.has(name) || (registry.has(name) && overwrite)) {
      registry.set(name, func);
    }
  }


  let get_function = function(procname) {
    let keys = registry.keys();
    let step = "",
      args = [];
    key = keys.next();
    while (!key.done) {
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
          func: registry.get(step),
          args: args
        };
        break;
      } else {
        key = keys.next();
      }
    }
  };


  let get_value = function(name) {
    return registry.get(name);
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
    let keys = registry.keys();
    let key = keys.next();
    console.log(`======= DUMPING REGISTRY =======`);
    console.log(key)
    while (!key.done) {
      // let value = registry.get(key.value);
      // switch (typeof value) {
      //   case "string":
          console.log(key.value, registry.get(key.value));
      //     break;
      //   case "object":
      //     if ()

      // }
      key = keys.next();
    }
  };


  let exists = function(key) {
    if (name instanceof RegExp) key = key.source;
    return registry.has(key);
  };



  return {
    dump: dump,
    exists: exists,
    register: register,
    get_value: get_value,
    get_function: get_function,
  };
};