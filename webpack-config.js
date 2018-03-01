const path = require('path');
const merge = require('webpack-merge');
const ClosureCompiler = require('google-closure-compiler-js').webpack;

module.exports = function getWebpackConfig(opts) {
    const config = {
        watch: opts.watch,
        devtool: false,
        entry: {
            [opts.libraryName]: opts.entry
        },
        output: {
            path: process.cwd(),
            filename: opts.output || '[name].bundle.js',
            library: opts.libraryName,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        plugins: [
            new ClosureCompiler({
                options: {
                    languageIn: 'ECMASCRIPT_2017',
                    languageOut: 'ECMASCRIPT5',
                    compilationLevel: 'SIMPLE',
                    rewritePolyfills: opts.polyfill,
                    createSourceMap: opts.createSourceMap
                }
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: require.resolve('babel-loader'),
                    options: {
                        presets: [require.resolve('babel-preset-react-es2015')],
                        plugins: [[require.resolve('babel-plugin-transform-react-jsx'), { pragma: 'h' }]],
                    }
                }
            ]
        },
        resolve: {
            modules: [
                path.resolve(__dirname, 'node_modules'),
                'node_modules'
            ]
        }
    };

    return merge(config, opts.customConfig || {});
}
