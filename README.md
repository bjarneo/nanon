Effortlessly transpile ES6 to ES5 UMD bundle
--
![Travis](https://travis-ci.org/bjarneo/nanon.svg?branch=master)

This CLI aims to solve my personal UMD bundling. It will transpile ES6 to ES5 and rewrite ES6 library calls to use polyfills provided by the Google Closure Compiler runtime.

[What is UMD?](https://github.com/umdjs/umd)

Usage
--

```js
$ npm i --save-dev nanon
```

```
    Usage
      $ nanon --input entrypoint.js --output output.bundle.js --name MyLibrary

    Options
      --input,       -i         Input ES6 entrypoint
      --output,      -o         Output bundle name
      --name,        -n         Library name
```

Instead of using arguments in the CLI, nanon fetches config set in `package.json`
```json
  "nanon": {
    "input": "index.js",
    "name": "MyLibrary",
    "output": "dist/library-name.min.js"
  },
```

Example
--
```bash
$ nanon --input index.js --ouput output.bundle.js --name MyLibrary
$ # Or if you've defined config in package.json
$ nanon
```

Now you can import your code:
CommonJS
```js
const MyLibrary = require('./output.bundle');
```

RequireJS
```js
require(['MyLibrary'], function(MyLibrary) {
    MyLibrary.doSomething();
});
```

Browser
```js
// Available on the window object
// window['MyLibrary']
// window.MyLibrary
MyLibrary.doSomething();
```

Contribution
--
Contributions are appreciated.

License
--
MIT-licensed. See LICENSE.
