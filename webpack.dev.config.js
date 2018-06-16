/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const Jarvis = require('webpack-jarvis');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/client/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'react',
              ['env', {
                targets: {
                  browsers: ['> 5%'],
                  forceAllTransforms: true,
                },
              }],
            ],
            plugins: [
              'transform-class-properties',
              'transform-object-rest-spread',
              'transform-runtime',
            ],
          },
        },
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new Jarvis({
      port: 1337,
    }),
  ],
};
