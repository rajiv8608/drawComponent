let webpack = require('webpack');
let path = require('path');
let autoprefixer = require('autoprefixer');
let perfectionist = require('perfectionist');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'app': './src/app.ts',
        'draw': './src/draw/index.ts'
    },

    resolve: {
        extensions: ['', '.js', '.ts', '.css', '.html']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css!postcss'),
                exclude: /node_modules/
            }
        ]
    },

    postcss: () => {
        return [autoprefixer({ browsers: ['Safari >= 8', 'last 2 versions'] }), perfectionist];
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['draw', 'app'].reverse()
        })
    ]
};