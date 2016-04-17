module.exports = commonformdiff

var diff = require('rfc6902-json-diff')
var defaultSplit = require('./split-strings')
var pointer = require('json-pointer')

var promotable = [ 'use', 'definition', 'reference' ]

function commonformdiff(a, b, split) {
  if (split === undefined) {
    split = defaultSplit }
  return diff(split(a), split(b))
    .map(function promoteEdits(operation) {
      var op = operation.op
      var path = pointer.parse(operation.path)
      var value = operation.value
      var lastToken = path[path.length - 1]
      if (op === 'replace' && promotable.indexOf(lastToken) > -1) {
        var newValue = { }
        newValue[lastToken] = value
        return {
          op: op,
          path: pointer.compile(path.slice(0, -1)),
          value: newValue } }
      // else if (op === 'add' && value.hasOwnProperty('splits')) {
      //   return {
      //     op: op,
      //     path: operation.path,
      //     value: value.splits } }
      return operation })}
