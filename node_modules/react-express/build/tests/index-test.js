(function() {
  var debug, expect, express, host, paths, reactexpress, request, util;

  paths = require("path");

  express = require("express");

  reactexpress = require("../index");

  expect = require('chai').expect;

  util = require("util");

  request = require("supertest");

  debug = require("debug")("react-express:tests:index-test");

  require("coffee-script").register();

  require('node-jsx').install({
    extension: '.jsx'
  });

  host = "http://localhost:1337/";

  describe('Middleware test', function() {
    before(function(done) {
      var app, data, port;
      app = express();
      port = 1337;
      data = {
        cache: "./cache",
        dir: "./build/tests/views/"
      };
      return reactexpress(data).then(function(rex) {
        app.set('view engine', 'coffee');
        app.engine("coffee", rex.viewEngine);
        app.set("views", paths.join(process.cwd(), data.dir));
        app.get("/", function(req, res, next) {
          debug("calling RENDER");
          return res.render("control", {
            name: "ansma"
          });
        });
        app.use(rex.cache);
        app.listen(port);
        return done();
      });
    });
    it('Express Test', function() {
      return request(host).get('').end(function(err, res) {
        expect(res.text).to.not.equal("");
        return debug("html test", res.text);
      });
    });
    return it('Express Test js', function() {
      return request(host).get('control.js').end(function(err, res) {
        expect(res.text).to.not.equal("");
        return debug("js test", res.text);
      });
    });
  });


  /*
  
  
      data = {
        cache: "./cache"
        basedir: "./build/tests/files/"
        routes: [{
          alias: [ "//", "index" ] # only works with component defined
          path: "./control.coffee"
          props: { name: "Tester 123" }
        }
        , {
         * // allows localhost/array/file.html
          path: "./*.coffee"
          basedir: "./tests/files/array/"
          layout: "./layout" #overrides using internal layout,
          props: (control) ->
            {}
        }
        ]
      }
   */

}).call(this);
