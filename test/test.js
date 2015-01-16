var path = require('path')
var test = require('tape')
var fs = require('fs')

var tmp = require('tmp')

var readlink = require('../')

test('non existing path errors', function (t) {
  readlink('/this/path/does/not/exist', function (err, result) {
    t.ok(err)
    t.equal(err.errno, 34)
    t.equal(err.code, 'ENOENT')
    t.end()
  })
})

test('existing folder expands to self', function (t) {
  tmpdir(function (err, dir) {
    t.ok(!err)
    readlink(dir, function (err, result) {
      t.equal(result, dir)
      t.end()
    })
  })
})

test('existing file expands to self', function (t) {
  tmp.file(function (err, file) {
    t.ok(!err)
    readlink(file, function (err, result) {
      t.equal(result, file)
      t.end()
    })
  })
})

test('symbolic link expands to same as fs.readlink()', function (t) {
  tmpdir(function (err, dir) {
    t.ok(!err)
    var symlink = path.join(dir, 'symlink')
    fs.symlink(dir, symlink, function (err) {
      t.ok(!err)
      readlink(symlink, function (err, result1) {
        fs.readlink(symlink, function (err, result2) {
          t.equal(result1, result2)
          t.end()
        })
      })
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
    t.ok(!err)
    tmpdir(function (err, dir2) {
      t.ok(!err)
      var basename = path.basename(dir2)
      var symlink = path.join(dir1, 'symlink')
      fs.symlink('/tmp', symlink, function (err) {
        t.ok(!err)
        var symlink2 = path.join(symlink, basename)
        readlink(symlink2, function (err, result) {
          t.ok(!err)
          t.equal(result, dir2)
          t.end()
        })
      })
    })
  })
})

function tmpdir(cb) {
  tmp.dir({ unsafeCleanup: true }, cb)
}
