const fs = require('fs')
const path = require('path')
const async = require('neo-async')

function readlink (link, cb) {
  let result = '/'
  if (link[0] !== '/') link = path.join(process.cwd(), link)
  const subPaths = link.split('/').splice(1)
  async.eachSeries(subPaths, (subPath, next) => {
    expandPath(path.join(result, subPath), (err, nextPath) => {
      if (err) return next(err)
      result = path.resolve(result, nextPath)
      next()
    })
  }, err => {
    cb(err, result)
  })
}

readlink.sync = link => {
  let result = '/'
  if (link[0] !== '/') link = path.join(process.cwd(), link)
  const subPaths = link.split('/').splice(1)
  subPaths.forEach(subPath => {
    result = path.resolve(result, expandPathSync(path.join(result, subPath)))
  })
  return result
}

function expandPath (path, cb) {
  fs.lstat(path, (err, stat) => {
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
