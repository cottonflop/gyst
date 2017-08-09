var next_token = function(data = "") {
    let out = data.split(" ");
    return [out.shift(), out.join(" ")];
  }

var parse = function(data) {
    [command, rhs] = next_token(data)
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

var last_command = "";

module.exports = {
  next_token : next_token,
  parse : parse
}