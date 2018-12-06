const path = require('path');

module.exports = {
    mode: 'production',
    watch: true,
    entry: {
        "helios": "./src/index.js",
        "helios.min": "./src/index.js",
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },


    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
