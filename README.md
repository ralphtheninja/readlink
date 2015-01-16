# readlink

`fs.readlink` only handles paths to symbolic links and not paths that contain symbolic links. This module solves this use case. Similar to `readlink(1)` with `-f` flag.

## Usage

Assuming `/tmp/foo` is a symbolic link pointing to the folder `/tmp/bar/baz` which in turn contains `file`. Then `readlink` expands `/tmp/foo/file` to the real path, e.g. `/tmp/bar/baz/file`.

```js
var readlink = require('readlink')
readlink('/tmp/foo/file', function (err, path) {
  console.log(path) // /tmp/bar/baz/file
})

```

## License
MIT