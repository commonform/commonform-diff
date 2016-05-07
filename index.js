module.exports = commonformdiff

var diff = require('rfc6902-json-diff')
var defaultSplit = require('./split-strings')
var pointer = require('json-pointer')

var promotableKeys = [ 'use', 'definition', 'reference', 'word' ]

function commonformdiff(a, b, split) {
  if (split === undefined) {
    split = defaultSplit }
  return diff(split(a), split(b))
    .map(function promoteEdits(operation) {
      var op = operation.op
      var path = pointer.parse(operation.path)
      var value = operation.value
      var lastToken = path[path.length - 1]
      var promotable = (
        ( op === 'replace' || op === 'add' ) &&
        promotableKeys.indexOf(lastToken) > -1 )
      if (promotable) {
        if (op === 'replace' || op === 'add') {
          var newValue = { }
          newValue[lastToken] = value
          return {
            op: op,
            path: pointer.compile(path.slice(0, -1)),
            value: newValue } } }
      return operation })}
