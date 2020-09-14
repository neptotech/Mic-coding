const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const { version } = require('./../package.json');

const ideVersion = `arduino-lab-${version}`;

module.exports = merge(base, {
  output: {
    publicPath: './dist/',
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({
        sourceMap: true,
        uglifyES: {
          output: {
            beautify: false, // 不需要格式化
            comments: false, // 保留注释
          },
          compress: { // 压缩
            warnings: false, // 删除无用代码时不输出警告
            collapse_vars: true, // 内嵌定义了但是只有用到一次的变量
            reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '../index.html'],
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve('./index.html'),
      template: path.resolve('./src/index.html'),
      ideVersion,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
      },
    }),
  ],
});
