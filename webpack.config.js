var path = require('path');
var webpack = require('webpack');
var args = require('yargs').argv;

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var IS_DEV = !args.env || args.env === 'dev';

module.exports = {
    devtool: 'source-map',
    watch: IS_DEV,
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'build.js',
        library:  'Export'
    },
    plugins: [
        new webpack.DefinePlugin({__DEV__: IS_DEV}),
        new ExtractTextPlugin('build.css'),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            chunks:   ['index'],
            title:    'index',
            filename: 'index.html'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-1'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test:    /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?{browsers:["last 5 version", "IE 9"]}!sass-loader')
            },
                {
                    test: /\.css$/,
                    loaders: [ 'style-loader', 'css-loader' ]
                },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }

        ]
    }
};
