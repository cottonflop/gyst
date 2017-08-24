var chalk = require('chalk');

var heading = function(msg) {
		let size = msg.length + 2;
		msg = chalk.yellow(msg);
		console.log(chalk.green("┌" + "─".repeat(size) + "┐"));
		console.log(chalk.green("│") + chalk.blue(` ${msg} `) + chalk.green("│"));
		console.log(chalk.green("└" + "─".repeat(size) + "┘"));
}

var log = function(...args) {
	args.forEach((arg) => console.log(arg));
}


module.exports = {
	heading: heading,
	log: log
}
