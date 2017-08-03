var fs = require('fs');
var path = require('path');


function *ls(path, ext) { //returns a directory listing iterator for the given path
  let files = fs.readdirSync(path);
  for (let i = 0; i < files.length; i++) {
    if (fs.lstatSync(`${path}/${files[i]}`).isDirectory()) {
      yield *ls(`${path}/${files[i]}`, ext);
    } else { //if (!fs.lstatSync(`${path}/${files[i]}`).isDirectory())
      if (ext === undefined || files[i].toLowerCase().endsWith(`.${ext.toLowerCase()}`))
        yield `${path}/${files[i]}`;
    }
  }
}

module.exports = {
  getCurrentDirectoryBase : function() {
    return path.basename(process.cwd());
  },

  directoryExists : function(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  ls : ls,

  lines : function*(filePath) {
    trim = (x) => { return x.trim() };
    try {
      let lines = fs.readFileSync(filePath, 'utf-8').split("\n").map(trim);
      for (var i = 0; i < lines.length; i++) {
        yield lines[i];
      }
    } catch (err) {
      console.log(err);
    }
  }
};