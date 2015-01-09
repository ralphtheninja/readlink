# readlink

Expands symbolic links similar to `readlink(1)` with `-f` flag set, i.e. it will expand each sub path if there are nested symlinks.

## Usage

Assuming `/tmp/foo` is a symlink pointing to the folder `/tmp/bar/baz` which in turn contains `file`. Then `readlink()` will expand `/tmp/foo/file` to the real path.

```js
var readlink = require('readlink')
readlink('/tmp/foo/file', function (err, path) {
  console.log(path) // /tmp/bar/baz/file
})

```

## License
MIT