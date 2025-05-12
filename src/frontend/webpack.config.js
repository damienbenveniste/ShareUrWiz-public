const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, "src/index.js"),
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ["node_modules", path.resolve(__dirname, "src")],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: '/' // to test
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', ["@babel/preset-react", {"runtime": "automatic"}]]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader?name=[name].[ext]',
                    },
                ],
            },
        ]
    },
    devServer: {
        // historyApiFallback: true
        historyApiFallback:{
            index:'./index.html'   // to test!
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico',
            manifest: './public/manifest.json'
        }),
        new Dotenv(),
    ],
    // performance: {
    //     hints: false,
    //     maxEntrypointSize: 512000,
    //     maxAssetSize: 512000
    // }
}