var chalk       = require('chalk');

position = function(s, index) {
	index = (index === undefined) ? 0 : index;
	s = s.substr(0, index);
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}

highlight = function(s, index) {
	return s.substr(0, index) + chalk.blue(s[index]) + s.substr(index+1);
}

var m = "1234567890\n1234567890\n1234567890\n\n1234567890\n1234567890\n"

var pos = parseInt((process.argv[2] === undefined) ? 10 : process.argv[2]);

console.log(position(m, pos));
console.log(highlight(m, pos));