const fs = require('fs')
const path = require('path')
const async = require('async')

function readlink (link, cb) {
  var result = '/'
  if (link[0] !== '/') link = path.join(process.cwd(), link)
  const subPaths = link.split('/').splice(1)
  async.eachSeries(subPaths, function (subPath, next) {
    expandPath(path.join(result, subPath), function (err, nextPath) {
      if (err) return next(err)
      result = path.resolve(result, nextPath)
      next()
    })
  }, function (err) {
    cb(err, result)
  })
}

readlink.sync = function (link) {
  var result = '/'
  if (link[0] !== '/') link = path.join(process.cwd(), link)
  const subPaths = link.split('/').splice(1)
  subPaths.forEach(function (subPath) {
    result = path.resolve(result, expandPathSync(path.join(result, subPath)))
  })
  return result
}

function expandPath (path, cb) {
  fs.lstat(path, function (err, stat) {
    if (err) return cb(err)
    if (stat.isSymbolicLink()) {
      return fs.readlink(path, cb)
    }
    cb(null, path)
  })
}

function expandPathSync (path) {
  if (fs.lstatSync(path).isSymbolicLink()) {
    return fs.readlinkSync(path)
  }
  return path
}

module.exports = readlink
