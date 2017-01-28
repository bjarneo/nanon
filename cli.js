#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const meow = require('meow');
const webpack = require('webpack');
const webpackConfig = require('./src/webpack-config');

const cli = meow(`
    Usage
      $ nanon entrypoint.js output.bundle.js --name my-awesome-library

    Options
      --input,       -i         Input ES6 entrypoint
      --output,      -o         Output bundle name
      --config,      -c         Custom webpack config
      --name,        -n         Library name
      --polyfill,    -p         Should polyfill es6 features

    Examples
      $ nanon --input entrypoint.js --output output.bundle.js --name my-awesome-library
`, {
    alias: {
        i: 'input',
        o: 'output',
        c: 'config',
        n: 'name',
        s: 'sourcemap',
        p: 'polyfill'
    }
});

const spinner = ora({
    text: 'Bundling library...',
    spinner: 'toggle'
});

spinner.start();

function result(err, stats) {
    if (err) {
        console.error(err);

        return undefined;
    }

    const output = stats.toJson(true);

    const errLen = output.errors.length;

    if (errLen) {
        console.log(chalk.white.bgRed('Some errors occured:'));

        for (let i = 0; i < errLen; i++) {
            console.error(output.errors[i]);
        }

        spinner.fail(':(');

        return undefined;
    }

    const warnLen = output.warnings.length;

    if (warnLen) {
        console.log(chalk.white.bgYellow('Warings:'));

        for (let i = 0; i < warnLen; i++) {
            console.warn(output.warnings[i]);
        }
    }

    spinner.succeed('Success!');
}

function getArguments() {
    // Validation is needed
    const pkg = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'));

    const pkgConf = pkg.nanon || {};

    const createBool = from => {
        if (
            !(cli.flags[from] || pkgConf[from]) ||
            cli.flags[from] === 'false' ||
            pkgConf[from] === 'false'
        ) {
            return false;
        }

        return true;
    };

    return () => ({
        entry: `${process.cwd()}/${cli.input[0] || cli.flags.input || pkgConf.input}`,
        output: cli.input[1] || cli.flags.output || pkgConf.output,
        libraryName: cli.flags.name || pkgConf.name,
        createSourceMap: createBool('createSourceMap'),
        polyfill: createBool('polyfill'),
        config: cli.flags.config ? JSON.parse(cli.flags.config) : {}
    });
}

const args = getArguments();

webpack(
    webpackConfig({
        entry: args().entry,
        output: args().output,
        libraryName: args().libraryName,
        createSourceMap: args().createSourceMap,
        polyfill: args().polyfill
    }, args().config),
    result
);
