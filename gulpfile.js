const gulp          = require('gulp');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const dest          = require('gulp-dest');
const babel         = require('gulp-babel');
const concat        = require('gulp-concat');
const browserSync = require('browser-sync');
const del           = require('del');
const imagemin      = require('gulp-imagemin');
const pngquant      = require('imagemin-pngquant');
const cache         = require('gulp-cache');
const rigger   = require('gulp-rigger');
const config = {
    src: 'src',
    build: 'build'
};


// tasks
gulp.task('rig', function () {
    gulp.src('src/templates/**/*.html')
        .pipe(rigger())
});

//sass
gulp.task('sass', function(){
    return  gulp.src('src/sass/**/*.sass')
            .pipe(sass())
            .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
            .pipe(gulp.dest('src/css'))
            .pipe(browserSync.reload({stream: true}));
});


//js
gulp.task('js', function () {
    return  gulp.src('src/js/**/*.js')
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            // .pipe(concat('common.js'))
            .pipe(gulp.dest(`${config.build}/js`))
});


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

//clean task
gulp.task('clean', function () {
    return del.sync('build');
});

gulp.task('clear', function () {
    return cache.clearAll();
});


//img last
gulp.task('img',function () {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('build/img'))
});




//build
gulp.task('build', ['rig', 'img', 'sass', 'js'], function () {
    var buildCss = gulp.src([
        'src/css/main.css',
        'src/css/libs.min.css'
    ])
        .pipe(gulp.dest('build/css'));

    var buildFonts = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'));


    var buildHtml = gulp.src('src/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('build'));


});



gulp.task('watch',['browser-sync', 'js', 'sass', 'rig'], function () {
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
    gulp.watch('src/sass/**/*.sass', browserSync.reload);
});

