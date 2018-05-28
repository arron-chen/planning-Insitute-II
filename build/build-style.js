// 构建样式gulp配置

 // 引入gulp
const gulp = require('gulp')
// 引入gulp-clean-css 压缩css插件
const cleanCSS = require('gulp-clean-css')
// 引入gulp-sass sass转换插件
const sass = require('gulp-sass')
// 引入gulp-rename 重命名插件
const rename = require('gulp-rename')
// 引入gulp-autoprefixer 样式前缀补全插件
const autoprefixer = require('gulp-autoprefixer')
// 引入gulp-sourcemaps 源代码map映射关系插件
const sourcemaps = require('gulp-sourcemaps')
// 引入配置文件
const config = require('../config')
// 获取cssName
const { cssName } = config.bundleName


// 编译转换sass gulp任务 任务名为“css”
gulp.task('css', function(){
  // 转换样式主文件（该主文件为所有样式输出出口）
  gulp.src('../src/styles/index.scss')
      // 通过gulp-sourcemaps初始化 源代码map映射关系
      .pipe(sourcemaps.init())
      // 通过gulp-sass 来编译转换scss为css
      .pipe(sass().on('error', sass.logError))
      // 通过gulp-autoprefixer 对样式前缀补全，兼容处理
      .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie > 8']
      }))
      // 压缩css样式
      .pipe(cleanCSS({
        // 保留所有特殊前缀 当用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除部分前缀
        keepSpecialComments: '*'
      }))
      // 将最终编译转换的css重命名为'ibase.css'
      .pipe(rename(`${cssName}.css`))
      // 将map映射关系文件写入ibase.css同级目录
      .pipe(sourcemaps.write('./'))
      // 把css、map文件写到
      .pipe(gulp.dest('../dist/styles'));
});

// 拷贝字体文件 gulp任务  任务名为“fonts”  将字体文件目录下的所有文件原封不动迁移到dist目录
gulp.task('fonts', function(){
  // 字体文件源目录所有文件
  gulp.src('../src/styles/common/iconfont/fonts/*.*')
      // 字体拷贝到目的目录
      .pipe(gulp.dest('../dist/styles/fonts'));
});


// 配置gulp watch 任务
gulp.task('watch', function(){
  gulp.watch('../src/styles/**/*',['css', 'fonts'])
});

gulp.task('dev',['css','fonts','watch']);

// 配置gulp 默认工作流顺序 'css'--> 'fonts'
gulp.task('default', ['css', 'fonts']);


