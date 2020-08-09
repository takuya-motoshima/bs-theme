const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");

module.exports = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1500,
    ignored: /node_modules/
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
    library: 'bs',
    libraryExport: '',
    libraryTarget: 'var',
    globalObject: 'this',
    pathinfo: false
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          'sass-loader'
        ]
      },
      {
        test: /\.(gif|png|jpg|jpeg|eot|wof|woff|woff2|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: (url, resourcePath, context) => {
                console.log('resourcePath=', resourcePath);
                if (/(src\/fonts\/)|(node_modules\/@fortawesome\/fontawesome\-free\/webfonts\/)/.test(resourcePath)) {
                // if (/src\/fonts\/|@fortawesome\/fontawesome-free\/webfonts\//.test(resourcePath)) {
                  return `fonts/${url}`;
                } else {
                  return `images/${url}`;
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Parsley: 'parsleyjs',
      'window.Parsley': 'parsleyjs'
    }),
    new EsmWebpackPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: 'build.css' }),
    new CopyPlugin({
      patterns: [
        { from: 'src/images/', to: 'images/' },
      ]
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    }
  },
  performance: {
    hints: false
  }
}