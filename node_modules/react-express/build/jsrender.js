(function() {
  var Promise, bgshim, browserify, debug, fs, mkdirp, paths;

  browserify = require("browserify");

  bgshim = require('browserify-global-shim');

  debug = require("debug")("react-express:jsrender");

  fs = require("fs");

  Promise = require("bluebird");

  mkdirp = require("mkdirp");

  paths = require("path");

  module.exports = function(src, target, options) {
    return new Promise(function(resolve, reject) {
      var appName, b, basedir, browserifyOptions, dirTarget, excludeReact, globalShim, stream;
      if (src == null) {
        return reject("no file is provided");
      }
      if (target == null) {
        return reject("no target is provided");
      }
      basedir = options.basedir, excludeReact = options.excludeReact, browserifyOptions = options.browserifyOptions, globalShim = options.globalShim, appName = options.appName;
      if (basedir == null) {
        basedir = process.cwd();
      }
      if (browserifyOptions == null) {
        browserifyOptions = {};
      }
      browserifyOptions.basedir = basedir;
      if (appName == null) {
        appName = "app";
      }
      if (globalShim == null) {
        globalShim = {};
      }
      b = browserify(browserifyOptions);
      if (excludeReact) {
        debug("excluding react");
        globalShim.react = 'React || React';
        globalShim = bgshim.configure(globalShim);
        b.transform(globalShim, {
          global: true
        });
        b.external("react");
      }
      b.require(src, {
        expose: appName
      });
      stream = b.bundle();
      dirTarget = "" + (paths.dirname(target)) + "/";
      debug("mkdirp", dirTarget);
      return mkdirp(dirTarget, function() {
        var write;
        write = fs.createWriteStream(target);
        debug("write stream created");
        stream.pipe(write);
        debug("piped");
        return write.on("close", function() {
          debug("fin");
          return resolve();
        });
      });
    });
  };

}).call(this);
