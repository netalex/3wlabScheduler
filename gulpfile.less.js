/*!
 * gulp
 * $ npm install gulp gulp-rename gulp-replace gulp-browserify gulp-less gulp-csso gulp-uglify gulp-jshint gulp-coffeelint gulp-notify gulp-livereload gulp-sourcemaps gulp-concat coffeeify del jshint-stylish --save-dev
 */

var gulp       = require('gulp');
var rename     = require('gulp-rename');
var replace    = require('gulp-replace');
var browserify = require('gulp-browserify');
var less       = require('gulp-less');
var csso       = require('gulp-csso');
var uglify     = require('gulp-uglify');
var jshint     = require('gulp-jshint');
var coffeelint = require('gulp-coffeelint');
var notify     = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var concat     = require('gulp-concat');
var coffeeify  = require('coffeeify')
var stylish    = require('jshint-stylish');
var del        = require('del');

/**
 * Paths for sources to be used with gulp
 */
var sources = {
    less: {
        targets: './global/pattern/to/less/target/files/**/*',
        prepare: './global/pattern/to/less/source/files/**/*',
        process: process.env.PWD + '/tmp', //files placed in an tmp order for later processing
        build:   './path/to/build/css'
    },

    javascript: {
        targets: './global/pattern/to/js/target/files/**/*',
        prepare: './global/pattern/to/js/source/files/**/*',
        process:process.env.PWD +'./tmp/javascript/**/*.js', //files placed in an tmp order for later processing
        build:   './path/to/build/js'
    },

    headerjs:    [
        './tmp/javascript/ext/jquery.js',
        './tmp/javascript/ext/modernizr-2.8.3.js'
    ],

    coffeelint:  './tmp/javascript/**/*.coffee',
    jslint:      './tmp/javascript/**/*.js',
    build:       './build'
};

/**
 * If true, than livereload is active for javascript and css
 */
var lr = false;

/**
 * deletes the last build
 */
gulp.task('clean', function (cb) {
    del(sources.build, cb);
});

/**
 * jshint task for all javascript files
 */
gulp.task('jslint', ['prepareJavascript'], function () {
    return gulp.src(javascript.prepare)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * coffeelint task for all coffee files
 */
gulp.task('coffeelint', ['prepareJavascript'], function () {
    return gulp.src(sources.coffeelint)
        .pipe(coffeelint())
        .pipe(coffeelint.reporter());
});

/**
 * prepare less files
 */
gulp.task('prepareLess', function () {
    return gulp.src(sources.less.prepare)
        .pipe(rename(function (path) {
            var dirnameArray = path.dirname.split('/less');

            if (dirnameArray[1]) {
                path.dirname = dirnameArray[1];
            } else {
                path.dirname = './';
            }
        }))
        .pipe(gulp.dest('./tmp/less'))
        .pipe(notify({ message: 'Prepare less files complete', 'onLast': true }));
});

/**
 * prepare javascript files
 */
gulp.task('prepareJavascript', function () {
    return gulp.src(sources.javascript.prepare)
        .pipe(rename(function (path) {
            var dirnameArray = path.dirname.split('/js');

            if(dirnameArray[1]){
                path.dirname = dirnameArray[1];
            } else {
                path.dirname = './';
            }
        }))
        .pipe(replace(/\'\/js/g, '\'' + process.env.PWD + '/tmp/javascript'))
        .pipe(replace(/\'bacon\'/g, '\'' + process.env.PWD + '/tmp/javascript/ext/bacon.js' + '\''))
        .pipe(gulp.dest('./tmp/javascript'))
        .pipe(notify({ message: 'Preparing javascript files complete', 'onLast': true }));
});

/**
 * Build task for the final css files
 */
gulp.task('less', ['prepareLess'], function () {
    var stream = gulp.src(sources.less.targets)
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: sources.less.process
        }))
        .pipe(sourcemaps.write())
        .pipe(csso())
        .pipe(gulp.dest(sources.less.build));

    lr && stream.pipe(livereload());
    return stream;
});

/**
 * Build task for the final javascript files
 */
gulp.task('scripts', ['clean', 'prepareJavascript'], function () {
    var stream = gulp.src(sources.javascript.targets)
        .pipe(browserify({
            transform: ['coffeeify'],
            extensions: ['.coffee']
        }))
        .pipe(rename(function(path) {
            path.basename = "simyo";
            path.extname = ".js"
        }))
        .pipe(uglify())
        .pipe(gulp.dest(sources.javascript.build))
        .pipe(notify({ message: 'javascript complete', 'onLast': true }));

    lr && stream.pipe(livereload());
    return stream;

});

/**
 * generate headerjs
 */
gulp.task('headerjs', ['prepareJavascript'], function () {
    var stream = gulp.src(sources.headerjs)
        .pipe(concat('header.js'))
        .pipe(uglify())
        .pipe(gulp.dest(sources.javascript.build))
        .pipe(notify({ message: 'header javascript complete', 'onLast': true }));
    return stream;
});

/**
 * Build task puts everything together for building the application
 */
gulp.task('build', ['less', 'scripts', 'headerjs'],  function (cb) {
    del('./tmp', cb);
});
