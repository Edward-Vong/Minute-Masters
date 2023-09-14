(function() {
  var Promise, extend, fs, rimraf;

  Promise = require("bluebird");

  rimraf = require("rimraf");

  fs = require("fs");

  extend = exports.extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };

  exports.merge = function(options, overrides) {
    return extend(extend({}, options), overrides);
  };

  exports.isGlob = function(str) {
    return str.indexOf("*") > -1;
  };

  exports.cleanDir = function(dir) {
    return new Promise(function(resolve, reject) {
      return rimraf(dir, function() {
        return fs.mkdir(dir, function(err) {
          if (err != null) {
            return reject(err);
          }
          return resolve();
        });
      });
    });
  };

}).call(this);
