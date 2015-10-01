<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" align="right" width="64" height="64" />

## js-data-nedb [![bower version](https://img.shields.io/bower/v/js-data-nedb.svg?style=flat-square)](https://www.npmjs.org/package/js-data-nedb) [![npm version](https://img.shields.io/npm/v/js-data-nedb.svg?style=flat-square)](https://www.npmjs.org/package/js-data-nedb) [![Circle CI](https://img.shields.io/circleci/project/js-data/js-data-nedb/master.svg?style=flat-square)](https://circleci.com/gh/js-data/js-data-nedb/tree/master) [![npm downloads](https://img.shields.io/npm/dm/js-data-nedb.svg?style=flat-square)](https://www.npmjs.org/package/js-data-nedb) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/js-data/js-data-nedb/blob/master/LICENSE)

nedb adapter for [js-data](http://www.js-data.io/).

### API Documentation
[DSNedbAdapter](http://www.js-data.io/docs/dsnedbadapter)

### Project Status

__Latest Release:__ [![Latest Release](https://img.shields.io/github/release/js-data/js-data-nedb.svg?style=flat-square)](https://github.com/js-data/js-data-nedb/releases)

### Quick Start
`bower install --save js-data js-data-nedb` or `npm install --save js-data js-data-nedb`.

Load `js-data-nedb.js` after `js-data.js`.

```js
var adapter = new DSLocalStorageAdapter();

var store = new JSData.DS();
store.registerAdapter('nedb', adapter, { default: true });

// "store" will now use the nedb adapter for all async operations
var User = store.defineResource({
  name: 'user',
  // path where you want the table file for this resource created
  filepath: 'path/to/userTable.db'
});

// nedb handler is available here
User.db; // don't run custom queries unless you know what you're doing

// one method you might want to call is User.db.persistence.compactDatafile()

// we don't specify a filepath here,
// so it's automatically created at "./post.db"
var Post = store.defineResource({
  name: 'post'
});
```

### Changelog
[CHANGELOG.md](https://github.com/js-data/js-data-nedb/blob/master/CHANGELOG.md)

### Community
- [Gitter Channel](https://gitter.im/js-data/js-data) - Better than IRC!
- [Announcements](http://www.js-data.io/blog)
- [Mailing List](https://groups.io/org/groupsio/jsdata) - Ask your questions!
- [Issues](https://github.com/js-data/js-data-nedb/issues) - Found a bug? Feature request? Submit an issue!
- [GitHub](https://github.com/js-data/js-data-nedb) - View the source code for js-data.
- [Contributing Guide](https://github.com/js-data/js-data-nedb/blob/master/CONTRIBUTING.md)

### Contributing

First, support is handled via the [Gitter Channel](https://gitter.im/js-data/js-data) and the [Mailing List](https://groups.io/org/groupsio/jsdata). Ask your questions there.

When submitting issues on GitHub, please include as much detail as possible to make debugging quick and easy.

- good - Your versions of js-data, js-data-nedb, etc., relevant console logs/error, code examples that revealed the issue
- better - A [plnkr](http://plnkr.co/), [fiddle](http://jsfiddle.net/), or [bin](http://jsbin.com/?html,output) that demonstrates the issue
- best - A Pull Request that fixes the issue, including test coverage for the issue and the fix

[Github Issues](https://github.com/js-data/js-data-nedb/issues).

#### Submitting Pull Requests

1. Contribute to the issue/discussion that is the reason you'll be developing in the first place
1. Fork js-data-nedb
1. `git clone git@github.com:<you>/js-data-nedb.git`
1. `cd js-data-nedb; npm install; bower install;`
1. Write your code, including relevant documentation and tests
1. Run `grunt test` (build and test)
1. Your code will be linted and checked for formatting, the tests will be run
1. The `dist/` folder & files will be generated, do NOT commit `dist/*`! They will be committed when a release is cut.
1. Submit your PR and we'll review!
1. Thanks!

### License

The MIT License (MIT)

Copyright (c) 2014-2015 Jason Dobry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
