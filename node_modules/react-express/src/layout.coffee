React = require "react"
{html, head, body, div, script, title, link} = React.DOM

module.exports = React.createClass {

  getDefaultProps: ->
    {
      appName: "app"
      link: []
      scripts: []
      html: ""
    }

  render: ->
    compProps = JSON.stringify @props.componentProps

    startup = "var app = require('#{@props.appName}');
      var r = React;
      if(!r) {
        r = require('react');
      }
      var container = document.getElementById('react-component');
      r.renderComponent(app(#{compProps}), container);"

    html {},
      head {},
        title {}, @props.title? if @props.title?
        @props.links.map (l) ->
          link l
        script {src: "//cdnjs.cloudflare.com/ajax/libs/react/0.11.0/react.min.js", type: "text/javascript"}
      body {},
        div {
          id: "react-component",
          dangerouslySetInnerHTML: {
            "__html": @props.html
          }
        }
        @props.scripts.map (s) ->
          script s
        script {
          type: "text/javascript",
          dangerouslySetInnerHTML: {
            "__html": startup
          }
        }

}
