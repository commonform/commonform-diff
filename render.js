module.exports = render

var diff = require('./')
var splitStrings = require('./split-strings')
var pointer = require('json-pointer')

var INT_RE = /^\d+$/

// Render a, showing edits from b.
function render(a, b) {
  var splitA = splitStrings(a)
  var splitB = splitStrings(b)
  var patch = diff(splitA, splitB, splitStrings)
  var clone = JSON.parse(JSON.stringify(splitA))
  patch.forEach(function(operation) {
    var op = operation.op
    var path = pointer
      .parse(operation.path)
      .map(function(key) {
        return ( INT_RE.test(key) ? parseInt(key) : key ) })
    var value = operation.value
    var containingArray
    var targetIndex
    if (op === 'remove') {
      get(clone, path).del = true }
    else if (op === 'add') {
      containingArray = get(clone, path.slice(0, -1))
      targetIndex = getNth(containingArray, path[path.length - 1])
      value.ins = true
      containingArray.splice(targetIndex, 0, value) }
    else if (op === 'replace') {
      containingArray = get(clone, path.slice(0, -1))
      targetIndex = getNth(containingArray, path[path.length - 1])
      containingArray[targetIndex].del = true
      value.ins = true
      containingArray.splice(targetIndex, 0, value) } })
  return clone }

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
// for deletion with `{ del: true }`.
function getNth(elements, target) {
  var length = elements.length
  var count = 0
  for (var index = 0; index < length; index++) {
    var element = elements[index]
    if (!element.hasOwnProperty('del')) {
      if (count === target) {
        return index }
      count++ } }
  return ( index + 1 ) }
