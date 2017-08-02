var fs = require('fs');
var path = require('path');

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

  asArray : function(filePath) {
    trim = (x) => { return x.trim() };
    try {
      return fs.readFileSync(filePath, 'utf-8').split("\n").map(trim);
    } catch(err) {
      console.log(err);
      return false;
    }
  }
};