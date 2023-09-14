paths = require "path"
express = require "express"
reactexpress = require "../index"
expect = require('chai').expect
util = require "util"
request = require "supertest"
debug = require("debug")("react-express:tests:index-test")
require("coffee-script").register()
require('node-jsx').install({extension: '.jsx'})

host = "http://localhost:1337/"

describe 'Middleware test', () ->
  before (done) ->
    app = express()
    port = 1337

    data = {
      cache: "./cache"
      dir: "./build/tests/views/"

    }

    reactexpress(data).then (rex) ->

      app.set 'view engine', 'coffee'
      app.engine "coffee", rex.viewEngine
      #app.engine "jsx", rex.viewEngine
      app.set "views", paths.join process.cwd(), data.dir
      app.get "/", (req, res, next) ->
        debug "calling RENDER"
        res.render "control", { name: "ansma" }
      app.use rex.cache
      app.listen(port)
      done()

  it 'Express Test', () ->
    request(host)
      .get('')
      .end (err, res) ->
        expect(res.text).to.not.equal("")
        debug "html test", res.text
  it 'Express Test js', () ->
    request(host)
      .get('control.js')
      .end (err, res) ->
        expect(res.text).to.not.equal("")
        debug "js test", res.text
###


    data = {
      cache: "./cache"
      basedir: "./build/tests/files/"
      routes: [{
        alias: [ "//", "index" ] # only works with component defined
        path: "./control.coffee"
        props: { name: "Tester 123" }
      }
      , {
      # // allows localhost/array/file.html
        path: "./*.coffee"
        basedir: "./tests/files/array/"
        layout: "./layout" #overrides using internal layout,
        props: (control) ->
          {}
      }
      ]
    }
###
