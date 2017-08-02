var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');

module.exports = {
  splash: function() {
	clear();
	console.log(
		chalk.green(figlet.textSync('Gyst', { font: "doom", horizontalLayout: 'default' })),
		"\n",
		chalk.blue("version " + require('./package.json').version)
	);
}
};
