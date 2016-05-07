module.exports = render

var diff = require('./')
var pointer = require('json-pointer')
var splitStrings = require('./split-strings')

// A string of digits.
var INT_RE = /^\d+$/

// Render a, showing edits from b.
function render(a, b) {
  var patch = diff(a, b)
    .map(function(operation) {
      if (operation.hasOwnProperty('value')) {
        operation.value = destringify(operation.value) }
      return operation })
  // Apply the patch operations to a clone of `a`.
  var clone = JSON.parse(JSON.stringify(splitStrings(a)))
  destringifyForm(clone)
  patch.forEach(function(operation) {
    var op = operation.op
    var path = pointer
      // Parse the JSON Pointer path.
      .parse(operation.path)
      // Convert string keys to numeric indices.
      .map(function(key) {
        return ( INT_RE.test(key) ? parseInt(key) : key ) })
    if (op === 'remove') {
      // Mark deleted.
      get(clone, path).deleted = true }
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
  return clone }

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

var expansions = {
  b: 'blank',
  d: 'definition',
  r: 'reference',
  u: 'use',
  w: 'word' }

function destringifyForm(form) {
  form.content = form.content.map(function(element) {
    if (typeof element === 'string') {
      return destringify(element) }
    else {
      destringifyForm(element.form)
      if (element.hasOwnProperty('heading')) {
        element.heading = element.heading
          .map(function(word) {
            return destringify(word) }) }
      return element } }) }

function destringify(string) {
  var split = string.split(':', 2)
  var typeCode = split[0]
  var value = split[1]
  var object = { }
  object[expansions[typeCode]] = value
  return object }
