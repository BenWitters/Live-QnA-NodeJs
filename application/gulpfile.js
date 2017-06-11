/**
 * Created by brent on 16/05/2016.
 */

var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css'); /*Minify css with clean-css*/
var concatCss = require('gulp-concat-css');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imagemin = require('gulp-imagemin'); /*Minify PNG, JPEG, GIF and SVG images*/
var uglify = require('gulp-uglify');

/*css auto prefixer*/
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');



/*JS minify*/
gulp.task('minify-js', function() {
     gulp.src('controllers/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/controllers'));

    gulp.src('app.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/'));

    gulp.src('models/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/models'));

    gulp.src('routes/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/routes'));
});




/*CSS auto prefixer
 This is an essential must have in your Gulp arsenal.
 What Autoprefixer does is allows you to write CSS without vendor prefixes and then will scan your CSS
 and add them in according to whatever you have configured and Caniuse.com usage statistics.
 This saves you having to use CSS libraries and writing multiple lines for things like Flexbox, etc.
 */
gulp.task('autoprefixer', function () {
    return gulp.src('public/stylesheets/css/*.css')
        .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/stylesheets/css/'));
});



/*CSS verkleinen en doorsturen naar cleanCSS*/
gulp.task('minify-css', function() {
    return gulp.src('public/stylesheets/css/*.css')

        /*voor files ingelezen samenvoegen en dan cleanen*/
        .pipe(concatCss("css/style.css"))

        /*doorsturen naar cleanCSS. Compatibiliteit garanderen met IE8. Kleuren in RGBA */
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('build'));
});





/*Optimalisatie van afbeeldingen*/
gulp.task('minify-png', () =>
    gulp.src('uploads/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('build/uploads'))
);

//aanbevolgen compressiealgoritme voor jpg
gulp.task('minify-jpg', function(){
    imagemin(['uploads/*.jpg'], 'build', {use: [imageminMozjpeg()]}).then(() => {
    });
});




/* Gulp taken automatisch runnen met watcher (gulp watch)*/
gulp.task('watch', function(){
    /*kijken of er iets in css wijzigt. dan taak ['taaknaam'] uitvoeren. */
    gulp.watch('./public/stylesheets/css/*.css', ['autoprefixer']);
    gulp.watch('./public/stylesheets/css/*.css', ['minify-css']);
    gulp.watch('./uploads/*.jpg', ['minify-jpg']);
    gulp.watch('./uploads/*.png', ['minify-png']);
});

