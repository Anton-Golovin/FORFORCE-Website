var gulp  			 = require('gulp'),
    clean			 = require('gulp-clean'),
    concat 			 = require('gulp-concat');
    csso             = require('gulp-csso'), 
    filter           = require('gulp-filter'),
    less             = require('gulp-less'),
    mainBowerFiles   = require('gulp-main-bower-files'),
    sourceMaps       = require('gulp-sourcemaps'),
    uglify           = require('gulp-uglifyjs'), 
    mergeStream      = require('merge-stream'),
    LessAutoprefix   = require('less-plugin-autoprefix');

var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var path = {
    dist: { //where
        all: './dist',
        fonts: './dist/fonts',
        css: './dist/css',
        js: './dist/js',
        img: './dist/img',
        libs: './dist/libs',
    },
    src: { //frome
        fonts: './src/fonts/**/*.*',
        less: './src/less/**/*.less',
        style: './src/less/style.less',
        js: './src/js/**/*.*',
        img: './src/img/**/*.*',
    },
    bowerJson: './bower.json', //bower
};


/*GULP WATCH*/
gulp.task('watch',function () {
    gulp.watch(path.src.less, ['less:dist']); //watch less
});


/*BUILD ALL*/
gulp.task('default', [
    'bower:dist',
    'less:dist',
    'fonts:dist'
]);


/*CLEAR ALL*/
gulp.task('clear:css', function () {  
    return gulp.src(path.dist.css)
        .pipe(clean())
});
gulp.task('clear:libs', function () {  
    return gulp.src(path.dist.libs)
        .pipe(clean())
});
/*clear fonts*/
gulp.task('clear:fonts', function () {  
    return gulp.src(path.dist.fonts)
        .pipe(clean())
});


/*DIST ALL*/
gulp.task('bower:dist', ['clear:libs'], function() {
    var filterJS = filter(['**/*.js'], { restore: true });
    var filterCSS = filter(['**/*.css'], { restore: true });
    return gulp.src(path.bowerJson)
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/bootstrap.css'
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(concat('libs/libs.min.js'))
        .pipe(uglify()) //compression js
        .pipe(filterJS.restore)
        .pipe(filterCSS)
        .pipe(concat('libs/libs.min.css'))
        .pipe(csso({
            sourceMap: true
        }))
        .pipe(filterCSS.restore)
        .pipe(gulp.dest(path.dist.all))
});
gulp.task('less:dist', ['clear:css'], function () {
	return gulp.src(path.src.style) 
    .pipe(sourceMaps.init())
    .pipe(less({
        plugins: [autoprefix]
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(path.dist.css))
});
/*dist fonts*/
gulp.task('fonts:dist', ['clear:fonts'], function () {  
    var myFonts = gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
    
    var bootstrapFonts = gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest(path.dist.fonts));

    return mergeStream(myFonts, bootstrapFonts);
});