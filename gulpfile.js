var gulp  			 = require('gulp'),
    clean			 = require('gulp-clean'),
    concat 			 = require('gulp-concat');
    csso             = require('gulp-csso'), 
    filter           = require('gulp-filter'),
    imagemin         = require('gulp-imagemin'),
    less             = require('gulp-less'),
    mainBowerFiles   = require('gulp-main-bower-files'),
    sourceMaps       = require('gulp-sourcemaps'),
    uglify           = require('gulp-uglifyjs'),
    spritesmith      = require('gulp.spritesmith'),
    imageminPngquant = require('imagemin-pngquant'),
    mergeStream      = require('merge-stream'),
    LessAutoprefix   = require('less-plugin-autoprefix');

var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var path = {
    dist: { //where
        all:    './dist/',
        fonts:  './dist/fonts/',
        css:    './dist/css/',
        js:     './dist/js/',
        img:    './dist/img/',
        libs:   './dist/libs/',
        style:   './src/style/',
    },
    src: { //frome
        allLess:    './src/style/**/*.less',
        styleLess:  './src/style/style.less',
        imgFolder: 	'./src/img/',
        img:        './src/img/**/*.*',
        sprite:     './src/img/sprite/*.*',
        fonts:      './src/fonts/**/*.*',
        js:         './src/js/**/*.*',
    },
    bowerJson:  './bower.json', //bower
};


/*GULP WATCH*/
gulp.task('watch',function () {
    gulp.watch(path.src.allLess, ['less:dist']); //watch less
    gulp.watch(path.src.js, ['js:dist']); //watch js
});

/*CLEAR ALL*/
//clear libs
gulp.task('clear:libs', function () {  
    return gulp.src(path.dist.libs)
        .pipe(clean())
});
//clear fonts
gulp.task('clear:fonts', function () {  
    return gulp.src(path.dist.fonts)
        .pipe(clean())
});
//clear img
gulp.task('clear:img', function () {  
    return gulp.src(path.dist.img)
        .pipe(clean())
});

/*DIST ALL*/
gulp.task('default', function() {
    console.log('Инструкция по сборке');
    console.log('1) Создать спрайты -> gulp sprite:dist');
    console.log('2) Запустить сборку -> gulp all:dist');
});

gulp.task('all:dist', [
    'bower:dist',
    'img:dist',
    'fonts:dist',
    'less:dist',
    'js:dist'
]);
//dist bower
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
//dist less
gulp.task('less:dist', function () {
	return gulp.src(path.src.styleLess) 
    .pipe(sourceMaps.init())
    .pipe(less({
        plugins: [autoprefix]
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(path.dist.css))
});
//dist fonts
gulp.task('fonts:dist', ['clear:fonts'], function () {  
    var myFonts = gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
    
    var bootstrapFonts = gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest(path.dist.fonts));

    return mergeStream(myFonts, bootstrapFonts);
});
//dist img
gulp.task('img:dist', ['clear:img'], function () {
    return gulp.src([path.src.img, '!./src/img/sprite/*.*'])
        .pipe(imagemin({
            progressive: true,
            use: [imageminPngquant()],
        }))
        .pipe(gulp.dest(path.dist.img))
});
//dist sprite
gulp.task('sprite:dist', function() {
    var spriteData = 
        gulp.src(path.src.sprite)
            .pipe(spritesmith({
                imgName: '../img/sprite.png',
                cssName: 'sprite.css',
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest(path.src.imgFolder));
    spriteData.css.pipe(gulp.dest(path.dist.style));
});
/*dist js*/
gulp.task('js:dist', function () {
    return gulp.src(path.src.js)
    .pipe(concat('script.min.js'))
    .pipe(sourceMaps.init())
    .pipe(uglify()) //compression js
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(path.dist.js))
});