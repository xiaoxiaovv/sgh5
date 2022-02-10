var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var nghtml2js = require('gulp-ng-html2js');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var px2rem = require('gulp-px3rem');

var configCheck = require('./config_check');

var paths = {
  sass: ['./scss/**/*.scss','./scss/rem_scss/**/*.scss'],
  js: [
    './www/js/app.js',
    "./www/js/framework/ConfigCommon.js", "./www/js/framework/ConfigInterceptors.js", "./www/js/framework/ConfigRoute.js",
    "./www/js/framework/AppRun.js",
    "./www/js/framework/UrlService.js",
    './www/js/**/!(appdev).js'
    ],
  // js: [
  //   './www/js/appdev.js',
  //   // "./www/js/framework/ConfigCommon.js", "./www/js/framework/ConfigInterceptors.js", "./www/js/framework/ConfigRoute.js",
  //   "./www/js/teamSupervise/**/*.js"
  //   // "./www/js/framework/UrlService.js",
  //   // './www/js/**/*.js'
  //   ],
  js_part1: [
    './www/js/cart/*js',
    './www/js/coupons/*js',
    './www/js/game/*js',
    './www/js/invoice/*js',
    './www/js/login/*js',
    './www/js/seckill/*js',
    './www/js/mine/*js'
  ],
  js_part2: [
    './www/js/common/*js',
    './www/js/framework/*js',
    './www/js/app.js'
  ],
  js_part3: [
    './www/js/product/*js',
    './www/js/shop/*js',
    './www/js/order/*js'
  ],
  templates: [
    "./www/templates/**/*.html"
  ],
  config_files: [
    './www/js/framework/UrlService.js'
  ]
};

gulp.task('default', ['watch']);

gulp.task('sass',['sass_rem'], function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});
gulp.task('sass_rem',function(done){
  gulp.src('./scss/app.rem.main.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(px2rem({
      baseDpr: 2,             // base device pixel ratio (default: 2)
      threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
      remVersion: true,       // whether to generate rem version (default: true)
      remUnit: 37.5,            // rem unit value (default: 75)
      remPrecision: 6         // rem precision (default: 6)
    }))
    .pipe(rename({
      basename: "app.rem.main",
      // prefix: "bonjour-",
      // suffix: "-hola",
      extname: ".css"
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      basename: "app.rem.main.min",
      // prefix: "bonjour-",
      // suffix: "-hola",
      extname: ".css"
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('babel-js',function(){
  gulp.src('./www/js/mine/vip.js')
    .pipe(babel())
    .pipe(gulp.dest('./www/js/mine'))
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  // gulp.watch(paths.js_part2, ['babel-js']);

});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


//gulp 压缩js脚本
gulp.task('js-zip', function (done) {
  gulp.src(paths.js)
    .pipe(concat('framework.js'))
    .pipe(gulp.dest('./www/release/'))
    /*.pipe(rename({suffix: '.min'}))
     .pipe(uglify())*/
    /*执行下一个任务*/
    .on('end', done);
});


//最小化framework.js
gulp.task('js-zip-mini', ['config_check'], function (done) {
  gulp.src(paths.js)
    .pipe(concat('framework.js'))
    .pipe(ngAnnotate())
    .pipe(uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe(gulp.dest('./www/release/'))
    /*执行下一个任务*/
    .on('end', done);
});

gulp.task('template2js', function (done) {
  gulp.src(paths.templates)
    .pipe(nghtml2js({
      moduleName: 'st',
      prefix: 'templates/'
    }))
    /*合并到templates.js文件中*/
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./www/release/'))
    /*.pipe(rename({suffix: '.min'}))
     .pipe(uglify())*/
    /*执行下一个任务*/
    .on('end', done);
});

//最小化template.js
gulp.task('template2js-mini', ['config_check'], function (done) {
  gulp.src(paths.templates)
    .pipe(nghtml2js({
      moduleName: 'st',
      prefix: 'templates/'
    }))
    /*合并到templates.js文件中*/
    .pipe(concat('templates.js'))
    // .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./www/release/'))


    .on('end', done);
});

gulp.task('config_check', function (done) {
  gulp.src(paths.config_files)
    .pipe(configCheck());
  done();
});


gulp.task('both', ['js-zip-mini', 'template2js-mini']);

