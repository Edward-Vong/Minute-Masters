/**
 * @jsx React.DOM
 */

var React = require('react')
var debug = require('debug')('react-express:tests:jsx')
debug("included")
module.exports = React.createClass({
  statics: {
    getScripts: function () {
      return [

      ]
    },
    getName: function () {
      return "superjsx";
    },
    getCSS: function () {
      return [
      ]
    }
  },
  getInitialState: function() {
    return {
      title: ""
    };
  },

  render: function() {
    debug("rendering element", this.props)
    return <div>Hello, {this.props.name}!</div>
  }
})
