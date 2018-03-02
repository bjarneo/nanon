UMD Bundler
--

This CLI aims to solve my personal UMD bundling. It makes it possible to transpile and bundle ES6/ES2017, React, and Preact with ease just by running one command.

Behind the scenes this wrapper uses Webpack and Google Closure Compiler.


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

Preact
--
Example creating UMD widgets with Preact (same applies for React):
```js
// index.js
import { h, render, Component } from 'preact';

class Clock extends Component {
    constructor() {
        super();
        this.state.time = Date.now();
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({ time: Date.now() });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render(props, state) {
        let time = new Date(state.time).toLocaleTimeString();
        return <span>{ time }</span>;
    }
}

module.exports = function MyClock() {
    render(<Clock />, document.getElementById('clock'));
}
```

```bash
$ nanon index.js index.min.js --name=MyClock
```

Now you can include the bundle and use the clock:
```html
<script src="index.min.js"></script>
<div id="clock"></div>
<script>
  MyClock();
</script>
``` 

Missing
--

* Currently it bundles the react/preact framework. Will make this optional.
* Watch mode is buggy
* Development mode

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
