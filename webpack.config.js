const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const Production = true;

const plugins = [
    // new BundleAnalyzerPlugin(),
    new BundleTracker({
        filename: './webpack-stats.json',
    }),

    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery',
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
];

if (Production) {
    console.log('Building for production');
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }));
    // TODO figure out why this plugin only works when devtool has eval flag.
    //   plugins.push(new webpack.optimize.UglifyJsPlugin({
    //     compressor: {
    //       warnings: false
    //     }
    // }));
} else {
    console.log('Building for development.');
}

module.exports = {
    entry: {
        app: './src/app.js',
        vendor: [
            'angular',
            'angular-route',
            'd3',
            'jquery',
            'angular-material',
            './node_modules/angular-material/angular-material.min.css',
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static/dist'),
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015'],
            },
        }, {
            test: /\.html$/,
            loader: 'html-loader',
        }, {
            test: /bootstrap\/dist\/js\/umd\//,
            loader: 'imports?jQuery=jquery',
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
        }, {
            test: /\.png$/,
            loader: 'url-loader?publicPath=/static/dist/&limit=100000',
        }, {
            test: /\.jpg$/,
            loader: 'file-loader',
        }, {
            test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
            loader: 'url-loader',
        }],
    },
    plugins: plugins,
};
