const path = require('path');

module.exports = {
  entry: ['./src/index.js'],
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/public'),
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
  plugins: [],
};
