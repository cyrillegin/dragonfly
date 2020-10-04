const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin');

module.exports = {
  entry: ['./src/index.js'],
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/public'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
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
      // jsExtension: '.gz',
    }),
    // new CompressionPlugin(),
    // new HtmlWebpackChangeAssetsExtensionPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
};
