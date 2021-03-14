const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        hot: true,
        port: 5000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}