var path = require('path')
var test = require('tape')
var fs = require('fs')

var tmp = require('tmp')

var readlink = require('../')

test('non existing path errors', function (t) {
  readlink('/this/path/does/not/exist', function (err, result) {
    t.ok(err)
    t.equal(err.code, 'ENOENT')
    t.end()
  })
})

test('non existing path throws (sync)', function (t) {
  t.throws(function () { readlink.sync('/this/path/does/not/exist') }, /ENOENT/)
  t.end()
})

test('existing folder expands to self', function (t) {
  tmpdir(function (err, dir) {
    t.ok(!err)
    readlink(dir, function (err, result) {
      t.error(err)
      t.equal(result, dir)
      t.end()
    })
  })
})

test('existing folder expands to self (sync)', function (t) {
  tmpdir(function (err, dir) {
    t.error(err)
    t.equal(readlink.sync(dir), dir)
    t.end()
  })
})

test('existing file expands to self', function (t) {
  tmp.file(function (err, file) {
    t.ok(!err)
    readlink(file, function (err, result) {
      t.error(err)
      t.equal(result, file)
      t.end()
    })
  })
})

test('existing file expands to self (sync)', function (t) {
  tmp.file(function (err, file) {
    t.ok(!err)
    t.equal(readlink.sync(file), file)
    t.end()
  })
})

test('symbolic link expands to same as fs.readlink()', function (t) {
  tmpdir(function (err, dir) {
    t.error(err)
    var symlink = path.join(dir, 'symlink')
    fs.symlink(dir, symlink, function (err) {
      t.error(err)
      readlink(symlink, function (err, result1) {
        t.error(err)
        fs.readlink(symlink, function (err, result2) {
          t.error(err)
          t.equal(result1, result2)
          t.end()
        })
      })
    })
  })
})

test('symbolic link expands to same as fs.readlinkSync()', function (t) {
  tmpdir(function (err, dir) {
    t.error(err)
    var symlink = path.join(dir, 'symlink')
    fs.symlink(dir, symlink, function (err) {
      t.error(err)
      t.equal(fs.readlinkSync(symlink), readlink.sync(symlink))
      t.end()
    })
  })
})

test('embedded symbolic link expands to real path', function (t) {
  // dir1     == /tmp/A
  // dir2     == /tmp/B
  // symlink  == /tmp/A/symlink -> /tmp
  // symlink2 == /tmp/A/symlink/B
  // test symlink2 expands to /tmp/B
  tmpdir(function (err, dir1) {
    t.error(err)
    tmpdir(function (err, dir2) {
      t.error(err)
      var basename = path.basename(dir2)
      var symlink = path.join(dir1, 'symlink')
      fs.symlink('/tmp', symlink, function (err) {
        t.error(err)
        var symlink2 = path.join(symlink, basename)
        readlink(symlink2, function (err, result) {
          t.error(err)
          t.equal(result, dir2)
          t.end()
        })
      })
    })
  })
})

test('embedded symbolic link expands to real path (sync)', function (t) {
  // dir1     == /tmp/A
  // dir2     == /tmp/B
  // symlink  == /tmp/A/symlink -> /tmp
  // symlink2 == /tmp/A/symlink/B
  // test symlink2 expands to /tmp/B
  tmpdir(function (err, dir1) {
    t.error(err)
    tmpdir(function (err, dir2) {
      t.error(err)
      var basename = path.basename(dir2)
      var symlink = path.join(dir1, 'symlink')
      fs.symlink('/tmp', symlink, function (err) {
        t.error(err)
        var symlink2 = path.join(symlink, basename)
        t.equal(readlink.sync(symlink2), dir2)
        t.end()
      })
    })
  })
})

function tmpdir (cb) {
  tmp.dir({ unsafeCleanup: true }, cb)
}
