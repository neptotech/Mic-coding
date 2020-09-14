const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    path.resolve('./src/blockly/task/arduino.js'),
  ],
  output: {
    filename: 'blockly_arduino.js',
    library: 'easyCodeBloclkyPythonBlocks',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
        }],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: require.resolve('url-loader'),
        options: {
          name: '[name].[hash:10].[ext]',
          limit: 20000
        }
      }
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /\.\/common_task/,
      './common_ide'
    )
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.less'],
  },
};
