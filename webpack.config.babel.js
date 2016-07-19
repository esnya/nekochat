import path from 'path';
import webpack from 'webpack';

const { NODE_ENV } = process.env;
const DEBUG = NODE_ENV === undefined || NODE_ENV === 'development';

export default {
    cache: DEBUG,
    debug: DEBUG,
    devtool: '#source-map',
    entry: './src/browser',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
        ],
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: DEBUG ? 'browser.js' : 'browser.min.js',
    },
    plugins: DEBUG ? [] : [
        new webpack.optimize.UglifyJsPlugin(),
    ],
};
