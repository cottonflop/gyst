var test = "i am a <testscript> with <valid> and <invalid cos of spaces> variables."

re = /(?:<)\w+(?:>)/g;

var s = "";
out = [];
while (s = re.exec(test)) {
	s = s[0].replace(/[<>]/g, "");
	out.push(s);
}
return [test.replace(/<\w+>/g, "(.*)")]

console.log(out);
