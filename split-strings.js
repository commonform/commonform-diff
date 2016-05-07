module.exports = splitStrings

var splitWords = require('./split-words')

function splitStrings(argument) {
  var returned = { }
  returned.content = argument.content
    .reduce(
      function(content, element) {
        if (typeof element === 'string') {
          return content.concat(
            splitWords(element)
              .map(function(word) {
                return stringify('w', word) })) }
        else if (element.hasOwnProperty('form')) {
          var child = { }
          if (element.hasOwnProperty('heading')) {
            child.heading = element.heading }
          child.form = splitStrings(element.form)
          if (element.hasOwnProperty('heading')) {
            child.heading = splitWords(element.heading)
              .map(function(word) {
                return stringify('w', word) }) }
          return content.concat(child) }
        else {
          var stringified
          if (element.hasOwnProperty('use')) {
            stringified = stringify('u', element.use) }
          else if (element.hasOwnProperty('definition')) {
            stringified = stringify('d', element.definition) }
          else if (element.hasOwnProperty('reference')) {
            stringified = stringify('r', element.reference) }
          else if (element.hasOwnProperty('blank')) {
            stringified = stringify('b', '') }
          return content.concat(stringified) } },
      [ ])
  if (argument.conspicuous) {
    returned.conspicuous = argument.conspicuous }
  return returned }

function stringify(type, string) {
  return ( type + ':' + string ) }
