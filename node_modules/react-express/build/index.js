(function() {
  var Promise, React, ReactExpress, debug, defaultOptions, glob, helper, jsrender, layout, paths, serveStatic,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Promise = require("bluebird");

  paths = require("path");

  serveStatic = require("serve-static");

  glob = require("glob");

  React = require("react");

  debug = require("debug")("react-express:index");

  helper = require("./helper");

  jsrender = require("./jsrender");

  layout = require("./layout");

  defaultOptions = {
    doctype: '<!DOCTYPE html>',
    dir: "./views",
    cache: "./cache",
    prefixpath: "react/",
    filter: "**/*.*"
  };

  module.exports = function(options) {
    return new Promise(function(resolve, reject) {
      var rex;
      rex = new ReactExpress(options);
      return rex.initialise().then(function() {
        return resolve(rex);
      }, reject);
    });
  };

  ReactExpress = (function() {
    function ReactExpress(opts) {
      this.viewEngine = __bind(this.viewEngine, this);
      this.renderHtml = __bind(this.renderHtml, this);
      this.generateJavascript = __bind(this.generateJavascript, this);
      this.initialise = __bind(this.initialise, this);
      this.jsfiles = {};
      this.options = helper.merge(defaultOptions, opts);
      this.cacheDir = paths.join(process.cwd(), this.options.cache);
      this.filesDir = paths.join(process.cwd(), this.options.dir);
    }

    ReactExpress.prototype.initialise = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          debug("options", _this.options, _this.cacheDir, _this.filesDir);
          _this.cache = serveStatic(_this.cacheDir);
          return helper.cleanDir(_this.cacheDir).then(_this.generateJavascript).then(function() {
            debug("done");
            return resolve();
          });
        };
      })(this));
    };

    ReactExpress.prototype.generateJavascript = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var globPath;
          debug("generateJavascript");
          globPath = paths.join(_this.filesDir, _this.options.filter);
          debug("globpath", globPath);
          return glob(globPath, function(err, files) {
            var dir, file, name, out, promises, r, relativeFile, _i, _len;
            if (err != null) {
              debug("generateJavascript: glob failed", err, globPath);
              return reject(err);
            }
            promises = [];
            for (_i = 0, _len = files.length; _i < _len; _i++) {
              file = files[_i];
              r = paths.relative(_this.filesDir, file);
              dir = paths.dirname(r);
              name = paths.basename(file, paths.extname(file));
              relativeFile = paths.join(dir, "" + name + ".js");
              out = paths.join(_this.cacheDir, relativeFile);
              promises.push(jsrender(file, out, {
                basedir: _this.filesDir,
                excludeReact: true,
                browserifyOptions: _this.options.browserifyOptions
              }));
              _this.jsfiles[file] = {
                fullPath: out,
                relative: relativeFile
              };
            }
            return Promise.all(promises).then(resolve, reject);
          });
        };
      })(this));
    };

    ReactExpress.prototype.renderHtml = function(filename, props) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cls, component, componentHtml, e, html, l, links, p, rel, scripts;
          if (_this.jsfiles[filename] == null) {
            debug("compiled file not found!");
            throw "compiled file not found!";
          }
          rel = _this.jsfiles[filename].relative;
          debug("rel", rel);
          cls = require(filename);
          scripts = [
            {
              src: rel,
              type: "text/javascript"
            }
          ];
          links = [];
          debug("cls.getScripts?");
          if (cls.getScripts != null) {
            scripts = scripts.concat(cls.getScripts());
          }
          if (cls.getCSS != null) {
            links = links.concat(cls.getCSS());
          }
          try {
            debug("creating component");
            component = cls(props);
            componentHtml = React.renderComponentToString(component);
          } catch (_error) {
            e = _error;
            debug("err", e);
          }
          p = {
            title: "",
            scripts: scripts,
            links: links,
            html: componentHtml,
            componentProps: props
          };
          l = layout(p);
          html = React.renderComponentToStaticMarkup(l);
          debug("render complete", html);
          return resolve(html);
        };
      })(this));
    };

    ReactExpress.prototype.viewEngine = function(filename, options, cb) {
      var componentProps;
      componentProps = helper.merge({}, options);
      delete componentProps["settings"];
      delete componentProps["_locals"];
      delete componentProps["cache"];
      return this.renderHtml(filename, componentProps).then(function(html) {
        return cb(null, html);
      });
    };

    return ReactExpress;

  })();

}).call(this);
