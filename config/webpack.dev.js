let path = require('path');
let webpack = require('webpack');
let webpackMerge = require('webpack-merge');
let commonConfig = require('./webpack.common.js');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
    devtool: 'inline-source-map',

    output: {
        path: path.resolve('dist'),
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },

    tslint: {
        emitErrors: false,
        failOnHint: true,
        resourcePath: 'src'
    },

    plugins: [
        new ExtractTextPlugin('[name].[hash].css'),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],

    devServer: {
        https: true,
        inline: true,
        compress: true,
        open: true,
        port: 3000,
        historyApiFallback: true,
        stats: 'minimal',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        outputPath: path.resolve('dist')
    }
});
