var files = require('./files.js');

module.exports = {
  parse : function(specsArray) {
  	specsArray.forEach((val, index) => {
  		[keyword, data] = val.split(/[\s\:](.*)/);
  		switch(keyword.toLowerCase()) {
  			case "given":
  			case "when":
  			case "then":
  				console.log(`g/w/t: ${data}`);
  				break;
  			case "scenario":
  				console.log(`new scenario: ${data}`);
  				break;
  		}
  	});
  }
}