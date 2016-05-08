/* Copyright 2016 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = commonformdiff

var destringify = require('./destringify')
var destringifyForm = require('./destringify-form')
var diff = require('./diff')
var pointer = require('json-pointer')
var stringifyForm = require('./stringify-form')
var stack = require('./stack')

// A string of digits.
var INT_RE = /^\d+$/

// Render a, showing edits from b.
function commonformdiff(a, b) {
  // The diff algorithm is run on stringified forms, so its edit operation
  // values for additions and replacements will be stringified. Destringify
  // them here.
  var patch = diff(a, b)
    .map(function(operation) {
      if (operation.hasOwnProperty('value')) {
        var value = operation.value
        if (value.hasOwnProperty('form')) {
          destringifyForm(value.form)
          value.heading = value.heading.map(destringify) }
        else {
          operation.value = destringify(value) } }
      return operation })
  // Apply the patch operations to a clone of `a`.
  var clone = JSON.parse(JSON.stringify(stringifyForm(a)))
  // Destringify the clone.
  destringifyForm(clone)
  // Apply each patch operation, preserving removed and replaced content
  // elements so they appear in the diff.
  patch.forEach(function(operation) {
    var op = operation.op
    var path = pointer
      // Parse the JSON Pointer path.
      .parse(operation.path)
      // Convert string keys to numeric indices.
      .map(function(key) {
        return ( INT_RE.test(key) ? parseInt(key) : key ) })
    if (op === 'remove') {
      var lastPath = path[path.length - 1]
      // If the operation is to remove an entire heading, mark every word in
      // the heading as deleted.
      if (lastPath === 'heading' || lastPath === 'conspicuous') {
        get(clone, path).forEach(function(element) {
          element.deleted = true }) }
      else {
        // Mark deleted.
        get(clone, path).deleted = true } }
    else {
      var containingArray
      var targetIndex
      var value = operation.value
      // Mark the new value as inserted.
      value.inserted = true
      // Find the array that contains the change.
      containingArray = get(clone, path.slice(0, -1))
      // Find the index of the element changed.
      targetIndex = getNth(containingArray, path[path.length - 1])
      if (op === 'add') {
        containingArray.splice(targetIndex, 0, value) }
      else if (op === 'replace') {
        // Mark the replaced element deleted.
        containingArray[targetIndex].deleted = true
        // Splice the replacement value in _after_ the replaced value.
        var afterTargetIndex = ( targetIndex + 1 )
        containingArray.splice(afterTargetIndex, 0, value) } } })
  return stack(clone) }

// Get a value from a nested data structure, using `getNth`, rather than
// `array[index]`, to resolve array indices.
function get(object, path) {
  if (path.length === 0) {
    return object }
  else {
    var key = path.shift()
    if (typeof key === 'number') {
      var index = getNth(object, key)
      return get(object[index], path) }
    else {
      return get(object[key], path) } } }

// Return the array index of the nth content element that has _not_ been marked
// for deletion with `{ deleted: true }`.
function getNth(elements, target) {
  var length = elements.length
  var count = 0
  for (var index = 0; index < length; index++) {
    var element = elements[index]
    if (!element.hasOwnProperty('deleted')) {
      if (count === target) {
        return index }
      count++ } }
  return ( index + 1 ) }
