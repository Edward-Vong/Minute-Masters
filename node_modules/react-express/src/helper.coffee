
Promise = require "bluebird"
rimraf = require "rimraf"
fs = require "fs"

extend = exports.extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  object

exports.merge = (options, overrides) ->
  extend (extend {}, options), overrides

exports.isGlob = (str) ->
  return str.indexOf("*") > -1


exports.cleanDir = (dir) ->
  return new Promise (resolve, reject) ->
    rimraf dir, () ->
      fs.mkdir dir, (err) ->
        if err?
          return reject(err)
        resolve()
