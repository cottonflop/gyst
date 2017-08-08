var files = require('./files.js');

module.exports = {
  parse : function(specsArray) {
  	specsArray.forEach((val, lineNumber) => {
  		[keyword, data] = val.split(/(\:|\s|\,)])(.*)/);
  		switch(keyword.toLowerCase()) {
        // case "context":
        //   break;

        // case "if": //conditional
        //   break;

        // case "otherwise": //conditional else
        // case "else":
        //   break;

        // case "examples": //read in table
        //   console.log();
        //   break;

  			case "given": //pre-req
          console.log(`pre-req: ${data}`);
          break;

  			case "when": //action
          console.log(`action: ${data}`);
          break;

  			case "then": //test condition
  				console.log(`test condition: ${data}`);
  				break;

  			case "scenario":
  				console.log(`new scenario: ${data}`);
  				break;

        case "background":
          console.log(`new scenario: ${data}`);
          break;

        case "feature":
          console.log(`new scenario: ${data}`);
          break;

        default:
          console.log(`Unknown keyword on line ${lineNumber}: "${keyword}"`);
          break;
  		}
  	});
  }
}