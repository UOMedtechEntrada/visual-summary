'use strict';
var webpack = require("webpack");
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: ['./src/app.jsx'],
    output: {
        path: path.join(__dirname,"../"),
        filename: "visual-summary.js"
    },
    plugins: [new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    // Ignore all locale files of moment.js to reduce final bundle size
    new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
    }),
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }),
    new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: { ecma: 6 }
    })],
    module: {
        rules: require("./rules.config"),
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}