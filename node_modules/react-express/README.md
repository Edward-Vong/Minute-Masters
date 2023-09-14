react-express
=============

Express view component to render the html and javascript for react components

Use at your own risk, is pretty alpha atm a bit of optimising needs to happen

- properties passed to render command will be applied to client and server rendering  
- Uses browserify to autogenerate the client side version of the page
- Able to use any language that is supported by nodejs require and browserify transforms via package.json/options config

## Todo App
https://github.com/Azerothian/react-todo-express

## Install
```
npm install express react-express --save

```
### jsx support
```
npm install node-jsx reactify --save
```
### coffee support
```
npm install coffee-script coffeeify --save
```

## Setup

### package.json
### jsx support
```
"browserify": { "transform": [ "reactify" ] }
```
### coffee support
```
"browserify": { "transform": [ "coffeeify" ] }
```

## app.coffee
[http://js2coffee.org/ <-- for js users! :D](http://js2coffee.org/)
```
#for jsx support
require('node-jsx').install({extension: '.jsx'})
#for coffee support
require("coffee-script").register()

paths = require "path"
express = require "express"

reactexpress = require "react-express"
require("coffee-script").register()
require('node-jsx').install({extension: '.jsx'})

app = express()
port = 1337

data = {
  cache: "./cache"
  dir: "./views/"
}

reactexpress(data).then (rex) ->

  #app.set 'view engine', 'coffee'
  app.engine "coffee", rex.viewEngine
  app.engine "jsx", rex.viewEngine

  #app.set "views", paths.join process.cwd(), data.dir
  app.get "/", (req, res, next) ->
    res.render "control.coffee", { name: "ansma" }
  app.get "/jsx", (req, res, next) ->
    res.render "jsxtest.jsx", { name: "jsxs" }
  app.use rex.cache
  app.listen(port)

```
## API

### Options
the options passed to the constructor is also passed to browserify for js compiling
- cachedir: location for compile javascript files
- basedir: path to the directory where you have your files
- browserifyOptions: options passed to browserify
