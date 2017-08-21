var chalk = require('chalk');

var heading = function(msg) {
		let size = msg.length + 2;
		msg = chalk.yellow(msg);
		console.log(chalk.green("┌" + "─".repeat(size) + "┐"));
		console.log(chalk.green("│") + chalk.blue(` ${msg} `) + chalk.green("│"));
		console.log(chalk.green("└" + "─".repeat(size) + "┘"));
}

module.exports = {
	heading: heading
}
