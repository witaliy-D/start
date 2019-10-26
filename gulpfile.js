'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleancss = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      imagemin = require('gulp-imagemin'),
      del = require('del'),
      mqpacker = require('@lipemat/css-mqpacker'),
      postcss = require('gulp-postcss'),
      server = require('browser-sync').create(),
      run = require('run-sequence'),
      plumber = require('gulp-plumber'),
      spritesmith = require('gulp.spritesmith'),
      merge = require('merge-stream'),
      svgstore = require('gulp-svgstore'),
      pngquant = require('imagemin-pngquant'),
      responsive = require('gulp-responsive'),
      cheerio = require('gulp-cheerio'),
      replace = require('gulp-replace'),
      svgmin = require ('gulp-svgmin'),
	  copy = require('gulp-copy'),
      cache = require('gulp-cache'),
	  panini = require("panini"),
	  rigger = require("gulp-rigger");



gulp.task('clean', function() {
  return del('dist');
});


gulp.task('html', function() {
  panini.refresh();
  return gulp.src('src/*.html')
  .pipe(plumber())
  .pipe(panini({
            root: 'src/',
            layouts: 'src/tpl/layouts/',
            partials: 'src/tpl/partials/',
            helpers: 'src/tpl/helpers/',
            data: 'src/tpl/data/'
        }))
  .pipe(gulp.dest('dist'))
  .pipe(server.stream());
});


gulp.task('sass', function() {
  return gulp.src('src/scss/style.scss')
  .pipe(plumber())
  .pipe(sass({
      outputStyle: 'expanded'
  }))
  .pipe(autoprefixer({
    grid: true,
    overrideBrowserslist: ['last 2 versions'],
  }))
  .pipe(postcss([
    mqpacker({
      sort: true
    })
  ]))
  .pipe(gulp.dest('dist/css'))
  .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('dist/css'))
  .pipe(server.stream());
});


gulp.task('fonts', function () {
  return gulp.src(['src/fonts/**/*'], {base: 'src'})
  .pipe(gulp.dest('dist'))
  .pipe(server.stream());
});


gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
  .pipe(plumber())
  .pipe(rigger())
  .pipe(gulp.dest('dist/js'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist/js'))
  .pipe(server.stream());
});                                


gulp.task('sprite', function () {
  const spriteData = gulp.src('src/img/sprite/*')
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true}),
    pngquant()
  ]))
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../img/sprite.png',
    padding: 1
  }));
  const imgStream = spriteData.img
  .pipe(gulp.dest('dist/img'));
  const cssStream = spriteData.css
  .pipe(gulp.dest('src/scss'));
  return merge(imgStream, cssStream);
});


gulp.task('imgs', function() {
  return gulp.src(['src/img/*', '!src/img/sprite', '!src/img/symbols'])
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true}),
    pngquant(),
	  imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {removeTitle: true},
      ]
    })
  ]))

  .pipe(gulp.dest('dist/img'))
});


gulp.task('symbols', function() {
  return gulp.src('src/img/symbols/*.svg')
  .pipe(svgmin({
    js2svg: {
      pretty: true
    },
    plugins: [
		{removeTitle: true},
		{removeViewBox: false},
	]
  }))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
      $('svg').attr('style', 'display:none');
    },
    parserOptions: {xmlMode: true}
  }))
  .pipe(replace('&gt;', '>'))
  .pipe(rename('symbols.html'))
  .pipe(gulp.dest('src/tpl/partials/'));
});


gulp.task('cleanImgs', function() {
  return del('dist/img');
});

 
gulp.task('imagesWatch', gulp.series('cleanImgs', gulp.parallel('imgs', 'symbols', 'sprite')), function (done) {
    server.reload();
    done();
});


gulp.task('serve', function() {
	server.init({
    server: 'dist'
  });
  gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('src/**/*.html', gulp.parallel('html'));
  gulp.watch('src/js/**/*.js', gulp.parallel('scripts'));
  gulp.watch('src/img/**/*', gulp.parallel('imagesWatch'));
  gulp.watch('src/fonts/**/*', gulp.parallel('fonts'));
});


gulp.task('build', gulp.series('clean', 'sprite', 'symbols', gulp.parallel('imgs', 'fonts', 'html', 'sass', 'scripts')));



//таск для очистки кэша при проблемах с картинками, запуск вручную
gulp.task('clear', function () {
  return cache.clearAll();
});

gulp.task('responsive', function () {          //запуск вручную
  gulp.src('src/images/*.{png,jreg,jpg}')
  .pipe(responsive(require('./responsiveConfig.js')))
  .pipe(gulp.dest('src/img'));
});



