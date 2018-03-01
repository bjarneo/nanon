With nanon you can effortlessly transpile ES6/ES2017 to a ES5 UMD bundle
--

This CLI aims to solve my personal UMD bundling. It will transpile ES6/ES2017 to ES5 and rewrite ES6/ES2017 library calls to use polyfills provided by the Google Closure Compiler runtime.

Behind the scenes this wrapper uses webpack and google closure compiler.


[What is UMD?](https://github.com/umdjs/umd)

Usage
--

```js
$ npm i --save-dev nanon
```

```
    Usage
      $ nanon entrypoint.js output.bundle.js --name MyLibrary
      $ # Or 
      $ nanon --input entrypoint.js --output output.bundle.js --name MyLibrary

    Options
      --input,       -i         Input ES6/ES2017 entrypoint
      --output,      -o         Output bundle name
      --name,        -n         Library name
      --polyfill,    -p         Should polyfill ES2017 features
      --watch,       -w         Turn on watch mode (webpack --watch)
```

Instead of using arguments within the CLI, nanon fetches config set in `package.json`
```json
  "nanon": {
    "input": "index.js",
    "output": "dist/library-name.min.js",
    "name": "MyLibrary"
  },
```

Example
--
Projects using nanon
* [extract-domain](https://github.com/bjarneo/extract-domain)
* [instantly](https://github.com/bjarneo/instantly)

```bash
$ nanon index.js output.bundle.js --name MyLibrary
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

Inspired by
--
* [Roc](https://github.com/rocjs/roc)
* [Next.js](https://github.com/zeit/next.js)

Contribution
--
Contributions are appreciated.

License
--
MIT-licensed. See LICENSE.
