const { series, src, dest, watch} = require('gulp');
const htmlClean = require('gulp-htmlclean');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
const stripDebug = require("gulp-strip-debug");
const uglify = require('gulp-uglify-es').default;
const imgMin = require('gulp-imagemin-fix');
const connect = require('gulp-connect');
const babel =  require('gulp-babel');
const folder = {
    src: 'src/',
    dist: 'dist/'  
} 

function html (cb) {
   return src(folder.src + 'html/*')
             .pipe(htmlClean())
             .pipe(dest(folder.dist+'html/'))
             .pipe(connect.reload());
}

function css (cb) {
    return src(folder.src + 'css/*')
             .pipe(less())
             .pipe(cleanCss())
             .pipe(dest(folder.dist+'css/'))
             .pipe(connect.reload());  
}  

function js () {
    return src(folder.src + 'js/*')
             .pipe(uglify())
             .pipe(dest(folder.dist+'js/'))
             .pipe(connect.reload());
}

function image () {
    return src(folder.src + 'images/*')
    .pipe(imgMin()) 
    .pipe(dest(folder.dist+'images/'))
}

function sever(cb) {
  connect.server({
      port: '1575',
      livereload: true, //自动刷新
  });
  cb();
}

watch(folder.src + 'html/*', function(cb) {
    html();
    cb();
})

watch(folder.src + 'css/*', function(cb) {
    css();
    cb();
})


watch(folder.src + 'js/*', function(cb) {
    js();
    cb();
})


exports.default = series(html, css, js, image, sever);