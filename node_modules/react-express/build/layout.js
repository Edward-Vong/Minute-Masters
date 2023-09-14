(function() {
  var React, body, div, head, html, link, script, title, _ref;

  React = require("react");

  _ref = React.DOM, html = _ref.html, head = _ref.head, body = _ref.body, div = _ref.div, script = _ref.script, title = _ref.title, link = _ref.link;

  module.exports = React.createClass({
    getDefaultProps: function() {
      return {
        appName: "app",
        link: [],
        scripts: [],
        html: ""
      };
    },
    render: function() {
      var compProps, startup;
      compProps = JSON.stringify(this.props.componentProps);
      startup = "var app = require('" + this.props.appName + "'); var r = React; if(!r) { r = require('react'); } var container = document.getElementById('react-component'); r.renderComponent(app(" + compProps + "), container);";
      return html({}, head({}, this.props.title != null ? title({}, this.props.title != null) : void 0, this.props.links.map(function(l) {
        return link(l);
      }), script({
        src: "//cdnjs.cloudflare.com/ajax/libs/react/0.11.0/react.min.js",
        type: "text/javascript"
      })), body({}, div({
        id: "react-component",
        dangerouslySetInnerHTML: {
          "__html": this.props.html
        }
      }), this.props.scripts.map(function(s) {
        return script(s);
      }), script({
        type: "text/javascript",
        dangerouslySetInnerHTML: {
          "__html": startup
        }
      })));
    }
  });

}).call(this);
