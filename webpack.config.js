﻿const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: './src/index.ts',
    mode: "development",
    output: {
        filename: '../wwwroot/js/ecommerce.min.js',
    },
    // Enable sourcemaps for debugging webpack's output. 
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions. 
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'. 
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [
        new DuplicatePackageCheckerPlugin({
            verbose: true,
        }),
    ],
    optimization: {
        minimize: true, // Toggle me to minimize or not
        minimizer: [
            new TerserPlugin(),
        ]
    }

};