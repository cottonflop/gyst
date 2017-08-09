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

  PROCEDURE: 10,
  SCENARIO: 11,
  BACKGROUND: 12,

  FEATURE: 20,

  TESTDATA: 30,
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
    case "examples":
      return token(SYMBOL.TESTDATA, token);
    default:
      return token(SYMBOL.UNKNOWN, token);
  }
}


var parse = function(token) {
  switch(token.type) {
    // technically thse can all just be treated the same,
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


/* var parse = function(token) {
    // [command, rhs] = next_token(data)
    // console.log(`<${command}> <${rhs}>`);
    switch(command.toLowerCase()) {
      case "and":
        command = last_command;
        parse(`${command} ${rhs}`);
        break;

      case "context:":
        break;

      case "if": //conditional
        break;

      case "otherwise": //conditional else
      case "else":
        break;

      case "examples": //read in table
        console.log();
        break;

      case "given": //pre-req
        console.log(`pre-req: ${rhs}`);
        break;

      case "when": //action
        console.log(`action: ${rhs}`);
        break;

      case "then": //test condition
        console.log(`test condition: ${rhs}`);
        break;

      case "scenario:":
        console.log(`scenario: ${rhs}`);
        break;

      case "background:":
        console.log(`background: ${rhs}`);
        break;

      case "feature:":
        console.log(`new feature: ${rhs}`);
        break;      

      case "procedure:":
        console.log(`procedure: ${rhs}`);
        break;

      case "":
        //blank line
        break;

      default:
        throw({ message: `Unknown command: "${command}"` });
        break;
    }
    last_command = command;
  }
*/

// var last_command = "";

module.exports = {
  next_token : next_token,
  parse : parse
}