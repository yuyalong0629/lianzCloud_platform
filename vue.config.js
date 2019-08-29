const path = require('path')
const webpack = require('webpack')
const AntDesignThemePlugin = require('antd-theme-webpack-plugin')
const options = {
  antDir: path.join(__dirname, './node_modules/ant-design-vue'),
  stylesDir: path.join(__dirname, './src'),
  varFile: path.join(
    __dirname,
    './node_modules/ant-design-vue/lib/style/themes/default.less'
  ),
  mainLessFile: '',
  themeVariables: ['@primary-color'],
  generateOnce: false
}

const themePlugin = new AntDesignThemePlugin(options)

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  // ESlint
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      themePlugin,
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('styles', resolve('src/assets/styles'))
      .set('utils', resolve('src/assets/utils'))
      .set('api', resolve('src/api'))
      .set('assets', resolve('src/assets'))
      .set('goods', resolve('src/views/product/pdm/goods'))
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      less: {
        modifyVars: {
          // less 变量覆盖，用于自定义 ant design 主题
          // 'primary-color': '#1890FF'
          // 'primary-color': '#1DA57A'
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        // target: 'http://192.168.1.127:9001',
        target: 'http://192.168.1.100:9001',
        // target: 'http://192.168.1.126:9001',
        // target: 'http://192.168.1.111:9001',
        // target: 'http://api.lianzcloud.com:9001',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}
