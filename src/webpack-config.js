const merge = require('lodash.merge');
const ClosureCompiler = require('google-closure-compiler-js').webpack;

module.exports = function getWebpackConfig(opts) {
    const config = {
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
                    languageIn: 'ECMASCRIPT6',
                    languageOut: 'ECMASCRIPT5',
                    compilationLevel: 'SIMPLE',
                    rewritePolyfills: opts.polyfill,
                    createSourceMap: opts.createSourceMap
                }
            })
        ]
    };

    return merge(config, opts.customConfig || {});
}
