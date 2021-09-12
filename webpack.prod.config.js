const path = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/client/index'],
  mode: 'production',
  devtool: false,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/public'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
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
      // jsExtension: '.gz',
    }),
    // new CompressionPlugin(),
    // new HtmlWebpackChangeAssetsExtensionPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
};
