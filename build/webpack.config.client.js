const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js'),
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/',
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html'),
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs',
    }),
  ],
})

if (isDev) {
  config.devtool = '#@cheap-module-eval-source-map'
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    hot: true,
    overlay: {
      errors: true,
      warnings: true,
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html',
    },
    proxy: {
      '/api': 'http://localhost:3333',
    },
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}
module.exports = config
