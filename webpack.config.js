var path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        // rules bevat de loaders die worden gebruikt, en waar ze naar zoeken.
        // Zoeken automatisch in je hele proj (of src. Geen idee).
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-private-methods']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            }
        ]
    },
    // Plugins wordt uitgevoerd over aangegeven docs (atm html en css)
    // Zorgt bijv. voor minimaliseren van code.
    // Plugins moeten als const ingeladen worden bovenaan doc.
    plugins: [
        new HtmlWebPackPlugin({
            title: "Magazijn App",
            template: "./src/index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};