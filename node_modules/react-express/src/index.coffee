Promise = require "bluebird"
paths = require "path"
serveStatic = require "serve-static"

glob = require "glob"
React = require "react"

debug = require("debug")("react-express:index")

helper = require "./helper"
jsrender = require "./jsrender"
layout = require "./layout"


defaultOptions = {
  doctype: '<!DOCTYPE html>'
  dir: "./views"
  cache: "./cache"
  prefixpath: "react/"
  filter: "**/*.*"

}


module.exports = (options) ->
  return new Promise (resolve, reject) ->
    rex = new ReactExpress options
    rex.initialise().then () ->
      resolve(rex)
    , reject

class ReactExpress
  constructor: (opts) ->
    @jsfiles = {}
    @options = helper.merge defaultOptions, opts
    @cacheDir = paths.join process.cwd(), @options.cache
    @filesDir = paths.join process.cwd(), @options.dir
  initialise: () =>
    return new Promise (resolve, reject) =>
      debug "options", @options, @cacheDir, @filesDir
      @cache = serveStatic @cacheDir
      helper.cleanDir(@cacheDir)
        .then @generateJavascript
        .then () ->
          debug "done"
          resolve()
  generateJavascript: () =>
    return new Promise (resolve, reject) =>
      debug "generateJavascript"
      globPath = paths.join @filesDir, @options.filter
      debug "globpath", globPath
      glob globPath, (err, files) =>
        if err?
          debug "generateJavascript: glob failed", err, globPath
          return reject(err)
        promises = []
        for file in files
          r = paths.relative @filesDir, file
          dir = paths.dirname(r)
          name = paths.basename(file, paths.extname(file))
          relativeFile = paths.join dir, "#{name}.js"
          out = paths.join @cacheDir, relativeFile
          #debug "out", out
          promises.push jsrender(file, out, {
            basedir: @filesDir
            excludeReact: true
            browserifyOptions: @options.browserifyOptions
          })
          @jsfiles[file] = {
            fullPath: out
            relative: relativeFile
          }
        Promise.all(promises).then resolve, reject


  renderHtml: (filename, props) =>
    return new Promise (resolve, reject) =>
      if !@jsfiles[filename]?
        debug "compiled file not found!"
        throw "compiled file not found!"
      rel = @jsfiles[filename].relative
      debug "rel", rel
      cls = require filename
      scripts = [ {src: rel, type: "text/javascript"} ]
      links = []
      debug "cls.getScripts?"
      if cls.getScripts?
        scripts = scripts.concat cls.getScripts()
      if cls.getCSS?
        links = links.concat cls.getCSS()
      try
        debug "creating component"
        component = cls(props)
        componentHtml = React.renderComponentToString component
      catch e
        debug "err", e

      p = {
        title: ""
        scripts: scripts
        links: links
        html: componentHtml
        componentProps: props
      }

      l = layout(p)
      html = React.renderComponentToStaticMarkup l
      debug "render complete", html
      resolve html
  viewEngine: (filename, options, cb) =>
    componentProps = helper.merge({}, options)

    delete componentProps["settings"]
    delete componentProps["_locals"]
    delete componentProps["cache"]
    @renderHtml(filename, componentProps).then (html) ->
      cb null, html
