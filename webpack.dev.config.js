/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const Jarvis = require('webpack-jarvis'); // eslint-disable-line
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // eslint-disable-line

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
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/react',
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['> 5%'],
                  },
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    // new Jarvis({
    //   port: 1337,
    // }),
  ],
};
