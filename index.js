var fs = require('fs')
var path = require('path')
var async = require('async')

function readlink(link, cb) {
  var result = '/'
  if (link[0] !== '/') link = path.join(process.cwd(), link)
  var sub_paths = link.split('/').splice(1)
  async.eachSeries(sub_paths, function (sub_path, next) {
    expandPath(path.join(result, sub_path), function (err, next_path) {
      if (err) return next(err)
      result = path.resolve(result, next_path)
      next()
    })
  }, function (err) {
    cb(err, result)
  })
}

readlink.sync = function (link) {
  var result = '/'
  if (link[0] !== '/') link = path.join(process.cwd(), link)
  var sub_paths = link.split('/').splice(1)
  sub_paths.forEach(function (sub_path) {
    result = path.resolve(result, expandPathSync(path.join(result, sub_path)))
  })
  return result
}

function expandPath(path, cb) {
  fs.lstat(path, function (err, stat) {
    if (err) return cb(err)
    if (stat.isSymbolicLink()) {
      return fs.readlink(path, cb)
    }
    cb(null, path)
  })
}

function expandPathSync(path) {
  if (fs.lstatSync(path).isSymbolicLink()) {
    return fs.readlinkSync(path)
  }
  return path
}

module.exports = readlink
