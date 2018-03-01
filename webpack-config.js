const path = require('path');
const merge = require('webpack-merge');
const ClosureCompiler = require('google-closure-compiler-js').webpack;

module.exports = function getWebpackConfig(opts) {
    const rules = () => {
        const list = [];

        const {
            isReact,
            isPreact
        } = opts;

        if (!isReact && !isPreact) {
            return list;
        }

        list.push({
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: require.resolve('babel-loader'),
            options: {
                presets: isReact || isPreact ? [require.resolve('babel-preset-react-es2015')] : [],
                plugins: isPreact ? [[require.resolve('babel-plugin-transform-react-jsx'), { pragma: 'h' }]] : [],
            }
        });

        return list;
    };

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
            rules: rules()
        }
    };

    return merge(config, opts.customConfig || {});
}
