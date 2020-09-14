const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  devServer: {
    contentBase: '.'
  },
  entry: ['babel-polyfill', path.resolve('./src/index.tsx')],
  output: {
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.(js|jsx)$/,
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
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre',
        include: /ec-ide-header/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', 'css-loader', 'less-loader',
        ],
      },
      {
        test: /\.(xml|py|text|txt|ino|lua)$/,
        use: ['raw-loader'],
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
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.less'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: true,
      minSize: 10000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 10,
      cacheGroups: {
        'ec-ide-header': {
          test: /ide-header/,
          priority: 5,
        },
        'ec-blockly': {
          test: /ec-blockly/,
          priority: 10,
        },
        eui: {
          test: /eui/,
          priority: 15,
        },
        'react-dom': {
          test: /(react-dom)/,
          priority: 22,
        },
        mobx: {
          test: /mobx/,
          priority: 10,
        },
      },
    },
  },
  node: {
    fs: "empty",
    child_process: "empty"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};
