const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.js');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    proxy: {
      '/common/**': {
        changeOrigin: true,
        target: 'https://dev.coding.qq.com',
      }
    }
  },
  // resolve: {
  //   alias: {
  //     '@tencent/ec-ide-header': path.resolve(__dirname, '../src/component/ide-header')
  //   }
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('./src/index.html'),
    }),
    // new CopyWebpackPlugin([
    //   { from: './static', to: './dist/static' },
    // ]),
  ],
});
