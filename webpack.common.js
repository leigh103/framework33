const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        framework33:'./src/index.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        // new HtmlWebpackPlugin({
        //     title: 'Output Management',
        // }),
    ],
    devServer: {
        contentBase: './src',
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },{
                test: /\.(png|svg|jpg|gif|html)$/,
                use: [
                    'file-loader',
                ],
            },{
                test: /\.styl$/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'stylus-loader',
                            options: {
                                stylusOptions: {
                                    compress: true
                                }
                            },
                        }
                    ],
                }
            ]
    },
};
