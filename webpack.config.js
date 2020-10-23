const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const WebpackMd5Hash = require('webpack-md5-hash'); 
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: {
        main: './src/js/index.js',
        articles: './src/js/articles/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './js/[name].[chunkhash].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    isDev ? 
                    'style-loader'
                    : 
                    { 
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader', 
                    'postcss-loader',
                ]
            },
            {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: 'file-loader?name=./vendor/[name].[ext]'
        },
        {
            test: /\.(png|jpe?g|gif|ico|svg)$/,
            use: [
                    {
                        loader: 'file-loader?name=./images/[name].[ext]' 
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {}
                },   
            ]
        }
         
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style/style.[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/i,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                    preset: ['default'],
            },
            canPrint: true
    }),
        new HtmlWebpackPlugin({ 
            inject: false,
            template: './src/pages/index.html',
            filename: 'index.html',
            chunks: ['main'],
        }),

        new HtmlWebpackPlugin({ 
            inject: false,
            template: './src/pages/articles.html',
            filename: 'articles.html',
            chunks: ['articles'],
        }),
       
        new WebpackMd5Hash(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        })
    ]
};