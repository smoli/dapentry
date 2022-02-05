const path = require('path');
const {VueLoaderPlugin} = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.vue$|\.m?js$|\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@vue/cli-plugin-babel/preset']
                    }
                }
            },

            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html"
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.vue', '.css']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
};