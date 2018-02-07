const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const supportBrowsers = ["last 2 versions", "ie >= 11", "ios >= 6", "android >= 4.0"];

module.exports = {
    entry: {
        build: './lib/main.js',
        'build-worker': './lib/worker.js'
    },
    output: {
        path: __dirname,
        filename: "./bin/[name].js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [ 'css-loader', 'clean-css-loader' ]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        [
                            'env', {
                                'targets': {
                                    "browsers": supportBrowsers
                                }
                            }
                        ],
                        'react'
                    ]
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin('./bin/build.css')
    ],
    node: {
        fs: "empty"
    },
    stats: {
        warnings: false
    }
};