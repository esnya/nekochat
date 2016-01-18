'use strict';

const browserify = require('browserify');
const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const express = require('gulp-express');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');

gulp.task('default', ['build']);

gulp.task('build', ['build:server', 'build:browser']);
gulp.task('build:server', ['babel']);
gulp.task('build:browser', ['browserify']);

gulp.task('serve', ['express']);

gulp.task('watch', ['watch:server', 'watch:browser']);
gulp.task('watch:server', ['express'], () => {
    gulp.watch(['src/**/*', '!src/browser/**/*'], ['babel', express.run]);
});
gulp.task('watch:browser', ['watchify'], () =>
    gulp.watch(['src/**/*', '!src/server/**/*'], ['watchify']));

gulp.task(
    'sync-lib',
    next => {
        let read = (dir) =>
            fs.readdirSync(dir)
                .map(item => `${dir}/${item}`)
                .map(item => 
                    fs.statSync(item).isDirectory()
                    ? read(item).concat([ item ])
                    : [ item ]
                )
                .reduce((a, b) => a.concat(b));
        read('lib')
            .filter(item => !fs.existsSync(item.replace(/^lib/, 'src')))
            .forEach(item => {
                gutil.log(`rm ${item}`);
                if (fs.statSync(item).isDirectory()) {
                    fs.rmdirSync(item);
                } else {
                    fs.unlinkSync(item);
                }
            });
        return next();
    }
);

gulp.task(
    'babel', ['sync-lib'],
    () => gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'))
);

const BrowserifyConfig = {
    entries: ['lib/browser'],
};
const bundle = function(b) {
    return function() {
        return b.bundle()
            .on('error', e => gutil.log(e))
            .pipe(source('browser.js'))
            .pipe(buffer())
            .pipe(gulp.dest('dist'));
    };
};
const w = watchify(browserify(Object.assign({}, watchify.args, BrowserifyConfig)));
w.on('update', bundle);
w.on('log', gutil.log);
gulp.task('watchify', ['babel'], bundle(w));
gulp.task('browserify', ['babel'], bundle(browserify(BrowserifyConfig)));

gulp.task('express', ['babel'], () => express.run(['.']));