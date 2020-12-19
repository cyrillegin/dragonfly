const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: ['./src/client/index.js'],
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/public'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  stats: 'errors-warnings',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
        },
        include: __dirname,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dragonfly',
      filename: 'index.html',
      template: 'src/server/public/index.html',
      scriptLoading: 'defer',
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
