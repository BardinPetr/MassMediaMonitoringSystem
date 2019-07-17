const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: '@svgr/webpack',
                options: {
                  babel: true,
                  icon: true,
                },
            },
        ]
    },
    plugins: [
        new CopyPlugin([
            {from: __dirname + '/static', to: __dirname + '/static_dist'},
        ]),
    ],
};