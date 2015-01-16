var test = require('tape')
var fs = require('fs')
var readlink = require('../')

test('non existing path errors', function (t) {
  readlink('/this/path/does/not/exist', function (err, result) {
    console.log(err, result)
    t.ok(err)
    t.equal(err.errno, 34)
    t.equal(err.code, 'ENOENT')
    t.end()
  })
})

