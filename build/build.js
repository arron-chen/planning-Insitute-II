'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

// 引入 ora 优雅的终端loading提醒
const ora = require('ora')
// 引入rimraf 以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除
const rm = require('rimraf')
// node path 模块
const path = require('path')
// 引入chalk颜色的插件 在终端显示颜色提醒
const chalk = require('chalk')
// 引入webpack
const webpack = require('webpack')
// 引入config配置文件
const config = require('../config')
// 引入webpack生成环境打包文件配置
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

// 删除之前的打包目录文件，再进行打包
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
