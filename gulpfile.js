var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var browserSync = require('browser-sync').create();
var babelify = require('babelify');
var exorcist = require('exorcist');

function bundle (bundler) {
    return bundler
        .transform(babelify)
        .bundle()
        .on('error', function (e) {
            gutil.log(e.message);
        })
        .pipe(exorcist('./app/dist/app.js.map'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./app/dist'))
        .pipe(browserSync.stream());
}

gulp.task('watch', function () {
    watchify.args.debug = true;
    var watcher = watchify(browserify('./app/app.js', watchify.args));
    bundle(watcher);
    watcher.on('update', function () {
        bundle(watcher);
    });
    watcher.on('log', gutil.log);

    browserSync.init({
        server: './app',
        logFileChanges: false
    });
});

gulp.task('js', function () {
    return bundle(browserify('./app/app.js'));
});

gulp.task('default', ['watch']);