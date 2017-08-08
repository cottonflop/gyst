var gulp = require('gulp');

gulp.task('default', function() {
  spawn('gyst', ['specs']);
});

