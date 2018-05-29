/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
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
      }, {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        }],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   filename: 'vendor.bundle.js',
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NamedModulesPlugin(),
    new UglifyJSPlugin({
      uglifyOptions: {
        topLevel: true,
                keep_classnames: false, // eslint-disable-line
        compress: {
                    keep_fargs: false, // eslint-disable-line
                    keep_fnames: false, // eslint-disable-line
          toplevel: true,
          unsafe: true,
                    unsafe_arrows: true, // eslint-disable-line
                    unsafe_methods: true, // eslint-disable-line
                    unsafe_Function: true, // eslint-disable-line
                    unsafe_math: true, // eslint-disable-line
                    unsafe_proto: true, // eslint-disable-line
                    unsafe_regexp: true, // eslint-disable-line
                    unsafe_undefined: true, // eslint-disable-line
                    drop_console: true, // eslint-disable-line
          passes: 2,
        },
        mangle: {
          eval: true,
          toplevel: true,
        },
      },
      exclude: /\/server/,
    }),
  ],
};
