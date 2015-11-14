var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var betterCsl = require('better-console');
var nodemon = require('gulp-nodemon');

gulp.task('mocha', function(){
    betterCsl.clear();
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec'}))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function(){
    gulp.watch(['test/**/*.js',
        'services/**/*.js',
        'controllers/**/*.js',
        'routes/**/*.js'],
        ['mocha']);
});

gulp.task('nodemon', function(){
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['./node_modules/**', './test/**']
    })
        .on('restart', function(){
            betterCsl.clear();
            betterCsl.log('Restarting');
        });
});

gulp.task('default', ['mocha', 'watch-mocha']);
