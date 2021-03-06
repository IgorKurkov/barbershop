/**
 * Created by house on 19.08.2017.
 */
var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    notify         = require('gulp-notify'),
    plumber        = require('gulp-plumber'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    fileinclude    = require('gulp-file-include');

//start server
gulp.task('start-server', function(){
    browserSync({
        server: {baseDir: 'app'},
        notify: true
    });
});

//convert sass
gulp.task('sass', function(){
    return gulp.src('app/sass/**/*+(.sass|.scss)')
        .pipe(sass().on("error", notify.onError()))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

// common scripts
gulp.task('common-js', function() {
    return gulp.src([
        'app/js/common.js'
    ])
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('scripts', ['common-js'], function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/mmenu/js/jquery.mmenu.all.min.js',
        'app/libs/owl.carousel/owl.carousel.min.js',
        'app/js/common.min.js' // Всегда в конце
    ])
        .pipe(concat('scripts.min.js'))
        // .pipe(uglify()) // Минимизировать весь js (на выбор)
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('html', function(){
    return gulp.src('app/template/index.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app/template'
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream: true}));
});
//main watch command
gulp.task('default', ['html', 'sass', 'common-js', 'scripts', 'start-server'], function(){
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/js/**/*.js', ['common-js', 'scripts']);
    gulp.watch('app/**/*.html', ['html', browserSync.reload]);
});

