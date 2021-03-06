/*
Copyright 2016 Kyle E. Mitchell

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

var diff = require('rfc6902-json-diff')
var stringifyForm = require('./stringify-form')
var pointer = require('json-pointer')

var promotableKeys = ['use', 'definition', 'reference', 'word']

module.exports = function commonformdiff (a, b) {
  return diff(stringifyForm(a), stringifyForm(b))
  // The diff algorithm will look for the least-costly edit script.
  // Sometimes that means it will replace properties of objects,
  // rather than the object as a whole. For example:
  //
  // From: [{reference: 'x'}]
  //
  // To:   [{reference: 'y'}]
  //
  // The shortest edit script is to replace `content/0/reference`,
  // rather than `content/0` as a whole.
  //
  // Replace undesirable property edits with object edits.
  .map(function promoteEdits (operation) {
    var op = operation.op
    var path = pointer.parse(operation.path)
    var value = operation.value
    var lastToken = path[path.length - 1]
    var promotable = (
      (op === 'replace' || op === 'add') &&
      promotableKeys.indexOf(lastToken) > -1
    )
    if (promotable) {
      if (op === 'replace' || op === 'add') {
        var newValue = { }
        newValue[lastToken] = value
        return {
          op: op,
          path: pointer.compile(path.slice(0, -1)),
          value: newValue
        }
      }
    }
    return operation
  })
}
