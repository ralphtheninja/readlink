const path = require('path')
const test = require('tape')
const fs = require('fs')
const tmp = require('tmp')
const readlink = require('../')

test('non existing path errors', t => {
  readlink('/this/path/does/not/exist', (err, result) => {
    t.ok(err)
    t.equal(err.code, 'ENOENT')
    t.end()
  })
})

test('non existing path throws (sync)', t => {
  t.throws(function () { readlink.sync('/this/path/does/not/exist') }, /ENOENT/)
  t.end()
})

test('existing folder expands to self', t => {
  tmpdir((err, dir) => {
    t.ok(!err)
    readlink(dir, (err, result) => {
      t.error(err)
      t.equal(result, dir)
      t.end()
    })
  })
})

test('existing folder expands to self (sync)', t => {
  tmpdir((err, dir) => {
    t.error(err)
    t.equal(readlink.sync(dir), dir)
    t.end()
  })
})

test('existing file expands to self', t => {
  tmp.file((err, file) => {
    t.ok(!err)
    readlink(file, (err, result) => {
      t.error(err)
      t.equal(result, file)
      t.end()
    })
  })
})

test('existing file expands to self (sync)', t => {
  tmp.file((err, file) => {
    t.ok(!err)
    t.equal(readlink.sync(file), file)
    t.end()
  })
})

test('symbolic link expands to same as fs.readlink()', t => {
  tmpdir((err, dir) => {
    t.error(err)
    const symlink = path.join(dir, 'symlink')
    fs.symlink(dir, symlink, err => {
      t.error(err)
      readlink(symlink, (err, result1) => {
        t.error(err)
        fs.readlink(symlink, (err, result2) => {
          t.error(err)
          t.equal(result1, result2)
          t.end()
        })
      })
    })
  })
})

test('symbolic link expands to same as fs.readlinkSync()', t => {
  tmpdir((err, dir) => {
    t.error(err)
    const symlink = path.join(dir, 'symlink')
    fs.symlink(dir, symlink, err => {
      t.error(err)
      t.equal(fs.readlinkSync(symlink), readlink.sync(symlink))
      t.end()
    })
  })
})

test('embedded symbolic link expands to real path', t => {
  // dir1     == /tmp/A
  // dir2     == /tmp/B
  // symlink  == /tmp/A/symlink -> /tmp
  // symlink2 == /tmp/A/symlink/B
  // test symlink2 expands to /tmp/B
  tmpdir((err, dir1) => {
    t.error(err)
    tmpdir((err, dir2) => {
      t.error(err)
      const basename = path.basename(dir2)
      const symlink = path.join(dir1, 'symlink')
      fs.symlink('/tmp', symlink, err => {
        t.error(err)
        readlink(path.join(symlink, basename), (err, result) => {
          t.error(err)
          t.equal(result, dir2)
          t.end()
        })
      })
    })
  })
})

test('embedded symbolic link expands to real path (sync)', t => {
  // dir1     == /tmp/A
  // dir2     == /tmp/B
  // symlink  == /tmp/A/symlink -> /tmp
  // symlink2 == /tmp/A/symlink/B
  // test symlink2 expands to /tmp/B
  tmpdir((err, dir1) => {
    t.error(err)
    tmpdir((err, dir2) => {
      t.error(err)
      const basename = path.basename(dir2)
      const symlink = path.join(dir1, 'symlink')
      fs.symlink('/tmp', symlink, err => {
        t.error(err)
        t.equal(readlink.sync(path.join(symlink, basename)), dir2)
        t.end()
      })
    })
  })
})

function tmpdir (cb) {
  tmp.dir({ unsafeCleanup: true }, cb)
}
