var gulp = require('gulp')
    , sass = require('gulp-sass')
    , sourcemaps = require('gulp-sourcemaps')
    , autoprefixer = require('gulp-autoprefixer')
    , ngannotate = require('gulp-ng-annotate')
    , uglify = require('gulp-uglify')
    , stripdebug = require('gulp-strip-debug')
    , concat = require('gulp-concat')
    , browserSync = require('browser-sync')
    , pkg = require('./package.json')
    , util = require('gulp-util')
    , watch = require('gulp-watch')
    , del = require('del')
    , rename = require('gulp-rename')
    , plumber = require('gulp-plumber')
    , runSequence = require('run-sequence');


var buildTarget = './dist', //where to build to. Do not include trailing
    appScss = './src/angular-hover-edit.scss',
    testFiles = testFiles = [
        '*.js'
        , './src/**/*.js'
        , '!Gruntfile.js'
        , '!gulpfile.js'
        , '!bower_components/**'
        , '!node_modules/**'
        , '!config/**'
    ],
    jsFiles = [].concat(testFiles, '!**/*_test.js'),
    appName = pkg.name,
    appVersion = pkg.version,
    buildName = pkg.version,
    staticRoot = '';


/*******************************
 * ON ERROR
 * ****************************/
var onErrorGen = onErrorGenFunc;

/*******************************
 * END Tasks for ALM
 * ****************************/


gulp.task('default', ['prod'], function () {
    'use strict';
});

gulp.task('local', [], function () {
    'use strict';

    console.log('Starting BrowserSync');
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.task('watch', function(){
        gulp.watch(jsFiles, ['js-watch']);
        gulp.watch(['index.html'], browserSync.reload);
        gulp.watch(appScss, ['sass']);
    });
    gulp.task('js-watch', ['js'], browserSync.reload);

    gulp.start('watch');
});

/*******************************
 * Delete build folder
 * ****************************/
gulp.task('clean', function(cb) {
    return del([buildTarget], cb);
});


/*******************************
 * Make build folder
 * ****************************/
gulp.task('build', ['clean', 'sass'], function (cb) {
    'use strict';
    console.log('Entered build phase');
    return gulp.start('js');
});

/***************************************************************************
 * SASS
 * Convert app.scss file to css, cachebust and copy to build folder
 *
 * *************************************************************************/
gulp.task('sass', function () {
    'use strict';
    //manages all things css and sass.

    return gulp.src('./src/' + appName + '.scss')
        .pipe(plumber(onErrorGen))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(rename(appName + '.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(buildTarget))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

/***************************************************************************
 * JS
 * concats minifies, and uglifies all NON thirdparty js files and copies
 * to build folder ['unitTests']
 * *************************************************************************/
gulp.task('js', function () {
    'use strict';
    //build the final js output
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(ngannotate())
        .pipe(stripdebug())
        .pipe(concat(appName + '.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildTarget));
});

/******************************************************************************************
 * ERROR function
 * ****************************************************************************************/
function onErrorGenFunc(err) {
    util.beep();

    var error
        , message = util.colors.red('\n-----------------------------------');

    message += util.colors.red('\nSass Error!');
    message += util.colors.yellow('\n' + err.message);
    message += util.colors.yellow('\non line: ' + err.line + ' at character: ' + err.column);
    message += util.colors.white('\nin ' + err.file);
    message += util.colors.red('\n-----------------------------------');

    error = new util.PluginError('SASS', {
        message: message
    });

    console.log(error);
    this.emit('end');
}
