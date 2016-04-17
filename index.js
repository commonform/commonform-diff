module.exports = commonformdiff

var diff = require('rfc6902-json-diff')
var defaultSplit = require('./split-strings')

function commonformdiff(a, b, split) {
  if (split === undefined) {
    split = defaultSplit }
  return diff(split(a), split(b)) }
