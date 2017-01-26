#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const meow = require('meow');
const webpack = require('webpack');
const webpackConfig = require('./src/webpack-config');

const cli = meow(`
    Usage
      $ nanon --input entrypoint.js --output output.bundle.js --name my-awesome-library

    Options
      --config,      -c         Custom webpack config
      --input,       -i         Input ES6 entrypoint
      --output,      -o         Output bundle name
      --name,        -n         Library name

    Examples
      $ nanon --input entrypoint.js --output output.bundle.js --name my-awesome-library
`, {
    alias: {
        c: 'config',
        i: 'input',
        o: 'output',
        n: 'name',
        s: 'sourcemap'
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

const config = cli.flags.config ? JSON.parse(cli.flags.config) : {};

// Validation is needed
const pkg = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'));

webpack(
    webpackConfig({
        entrypoint: `${process.cwd()}/${cli.flags.input || pkg.nanon.input}`,
        libraryName: cli.flags.name || pkg.nanon.name,
        output: cli.flags.output || pkg.nanon.output,
        createSourceMap: cli.flags.sourcemap || pkg.nanon.sourcemap || false
    }, config),
    result
);
