var path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    output: {
        filename: 'bundle.js'       
    },

    module: {
        loaders: [
            { test: /\.jsx?$/, loader: 'babel', }
        ]
    },
    entry: {
        main: "./src/index.js",
    },
    mode: "development",
    output: {
        filename: "[name]-bundle.js",
        path: path.resolve(__dirname, './dist/'),
        publicPath: "/"
    },
    devServer: {
        contentBase: "./dist/",
        index: "Index.html",
        overlay: {
            warnings: true,
            errors: true
        },
        stats: {
            colors: true
        }
    },
    devtool: 'eval-source-map',
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
                type: 'javascript/auto',
                test: /\.(png|svg|jpg|gif)$/,
                // exclude: /node_modules/,
                use: [{
                    loader: 'file-loader',
                    // options: {name: '[name].[ext]'},
                }]
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
        new CopyPlugin({
            patterns: [
                {from: './src/resources/', to: './resources'},
            ]
        }),
        new HtmlWebPackPlugin({
            title: "Magazijn App",
            template: "./src/view/Index.html",
            filename: "./Index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ]
};