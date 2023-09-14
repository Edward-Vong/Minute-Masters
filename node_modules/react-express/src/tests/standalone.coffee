paths = require "path"
express = require "express"
reactexpress = require "../index"
expect = require('chai').expect
util = require "util"
request = require "supertest"
debug = require("debug")("react-express:tests:standalone")
require("coffee-script").register()
require('node-jsx').install({extension: '.jsx'})

app = express()
port = 1337

data = {
  cache: "./cache"
  dir: "./views/"
  browserifyOptions: {}
}

reactexpress(data).then (rex) ->

  #app.set 'view engine', 'coffee'
  app.engine "coffee", rex.viewEngine
  app.engine "jsx", rex.viewEngine

  app.set "views", paths.join process.cwd(), data.dir
  app.get "/", (req, res, next) ->
    res.render "control.coffee", { name: "ansma" }
  app.get "/jsx", (req, res, next) ->
    res.render "jsxtest.jsx", { name: "jsxs" }
  app.use rex.cache
  app.listen(port)
