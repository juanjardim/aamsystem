var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var console = require('better-console');

gulp.task('mocha', function(){
    console.clear();
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec'}))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function(){
    gulp.watch(['test/**/*.js'], ['mocha']);
});

gulp.task('default', ['mocha', 'watch-mocha']);