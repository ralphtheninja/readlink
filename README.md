# readlink

> Expand nested symbolic links to real paths.

[![Build Status](https://travis-ci.org/ralphtheninja/readlink.svg)](https://travis-ci.org/ralphtheninja/readlink)
[![Greenkeeper badge](https://badges.greenkeeper.io/ralphtheninja/readlink.svg)](https://greenkeeper.io/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

`fs.readlink` only handles paths to symbolic links and not paths that contain symbolic links. This module solves this use case. Similar to `readlink(1)` with `-f` flag.

## Usage

Assuming `/tmp/foo` is a symbolic link pointing to the folder `/tmp/bar/baz` which in turn contains `file`. Then `readlink` expands `/tmp/foo/file` to the real path, e.g. `/tmp/bar/baz/file`.

```js
var readlink = require('readlink')
readlink('/tmp/foo/file', function (err, path) {
  console.log(path) // /tmp/bar/baz/file
})

```

## API

There are two methods. One async and one synchronous.

### readlink(path, cb)

### readlink.sync(path)

Where `path` is a string and `cb` is a node style callback with `err` and `result`.

## License

MIT
