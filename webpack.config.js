const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenUI5Plugin = require('openui5-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: {
        bundle: './src/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /manifest\.json$/,
                type: "javascript/auto",
                use: {
                    loader: "openui5-manifest-loader",
                    options: {
                        translations: ["en", "de"],
                    },
                },
            },
            {
                test: /@openui5[/\\].*\.js$/,
                use: "openui5-renderer-loader",
            },
            {
                test: /\.xml$/,
                use: 'openui5-xml-loader',
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: [
            "node_modules/@openui5/sap.m/src",
            "node_modules/@openui5/sap.ui.core/src",
            "node_modules/@openui5/sap.ui.core/src/sap/ui/thirdparty", // workaround for signals dependency in hasher
            "node_modules/@openui5/sap.ui.support/src",
            "node_modules/@openui5/themelib_sap_belize/src",
            "node_modules"
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "GFXBCTS"
        }),
        new OpenUI5Plugin({
            modulePath: "sap/ui/demo/todo",
            libs: ["sap.ui.core", "sap.m"],
            translations: ["en", "de"],
            theme: ["sap_belize", "sap_belize_plus"],
            requireSync: [
                "sap/ui/demo/todo/Component"
            ],
            manifest: "./manifest.json"
        }),
    ]
};