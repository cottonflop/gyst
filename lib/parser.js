// let keywords  = ["given", "when", "then", "scenario:", "procedure:", "feature:", "examples:", "background"];
let token_types = ["setup", "action", "check", "scenario", "procedure", "feature", "testdata"]

let SYMBOL = {
  UNKNOWN: -1,

  SETUP: 0,
  ACTION: 1,
  CHECK: 2,

  IF: 3,
  THEN: 4,
  ELSE: 5,

  SET: 6,
  GET: 7,

  SCOPE: 8,

  PROCEDURE: 10,
  SCENARIO: 11,
  BACKGROUND: 12,

  FEATURE: 20,

  TESTDATA: 30,

  NATIVE: 999,
}

function sym(value) {
  return Object.keys(SYMBOL).find(key => SYMBOL[key] === value);
}

let errors = [];

let pos = [0, 0];

let context = "";

error = function(msg) {

}


token = function(type, text) {
  return { type: type, text: data };
}

// var next_token = function(data = "") {
//   let out = data.split(" ");
//   return [out.shift(), out.join(" ")];
//   }

var tokenize = function(data, terminals = ["\n", " "]) {
  var out = "";
  chars = data.split("");
  c = chars.shift();
  while (!terminals.includes(c) && chars.length > 0) {
    out += c;
    c = chars.shift();
  }
  return [out, chars.join("")];
}


var stokenize = function(text, terminals = ["\n", " "]) {
  var out = "";
  for (var i = 0; i < text.length; i++) {
    if (terminals.includes(text[i]))
      break;
    out += text[i];
  }
  return [out, text.substring(i+1)];
}


var remainder = function(data) {
  return tokenize(data, "\n");
}


var eat_spaces = function(data) {
  var out = "";
  chars = data.split("");
  c = chars.shift();
  while (c.match(/\s/)) {
    c = chars.shift();
  }
  return chars.join("");
}


var lex = function(token) {
  switch(token.toLowerCase()) {
    case "given":
      return token(SYMBOL.SETUP, token);
    case "when":
      return token(SYMBOL.ACTION, token);
    case "then":
      return token(SYMBOL.CHECK, token);
    case "scenario:":
      return token(SYMBOL.SCENARIO, token);
    case "procedure:":
      return token(SYMBOL.PROCEDURE, token);
    case "examples:":
      return token(SYMBOL.TESTDATA, token);
    case "native:":
      return token(SYMBOL.NATIVE, token);
    default:
      return token(SYMBOL.UNKNOWN, token);
  }
}


var parse = function(token, rhs) {
  switch(token.type) {
    case SYMBOL.NATIVE:
      break;
    // technically these can all just be treated the same,
    // per the cucumber def, but i'd like to have them be
    // different in the long term
    case SYMBOL.SETUP:
    case SYMBOL.ACTION:
    case SYMBOL.CHECK:
      break;
    
    //TODO: these should both register a step def, but only scenarios should be added to the execution list
    case SYMBOL.SCENARIO:
      //add to execution list
    case SYMBOL.PROCEDURE:
      //define procedure
      break;
    
    case SYMBOL.TESTDATA
      //TODO: parse table data, oh my!
      break;

    case SYMBOL.UNKNOWN:
      error(`Unknown token: ${token.text}`);
      break;

    default:
      error("We should never get here?!");
      break;
  }
}


module.exports = {
  next_token : next_token,
  parse : parse
}