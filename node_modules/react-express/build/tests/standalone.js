(function() {
  var app, data, debug, expect, express, paths, port, reactexpress, request, util;

  paths = require("path");

  express = require("express");

  reactexpress = require("../index");

  expect = require('chai').expect;

  util = require("util");

  request = require("supertest");

  debug = require("debug")("react-express:tests:standalone");

  require("coffee-script").register();

  require('node-jsx').install({
    extension: '.jsx'
  });

  app = express();

  port = 1337;

  data = {
    cache: "./cache",
    dir: "./views/",
    browserifyOptions: {}
  };

  reactexpress(data).then(function(rex) {
    app.engine("coffee", rex.viewEngine);
    app.engine("jsx", rex.viewEngine);
    app.set("views", paths.join(process.cwd(), data.dir));
    app.get("/", function(req, res, next) {
      return res.render("control.coffee", {
        name: "ansma"
      });
    });
    app.get("/jsx", function(req, res, next) {
      return res.render("jsxtest.jsx", {
        name: "jsxs"
      });
    });
    app.use(rex.cache);
    return app.listen(port);
  });

}).call(this);
