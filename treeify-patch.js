module.exports = treeifyPatch

var get = require('keyarray-get')
var pointer = require('json-pointer')
var setp = require('setp')

var ALL_DIGITS = /^[0-9]+$/

function treeifyPatch(patch, tree) {
  if (tree === undefined) {
    tree = { } }
  patch.forEach(function(element) {
    var path = pointer
      .parse(element.path)
      .map(function(element) {
        if (ALL_DIGITS.test(element)) {
          return parseInt(element) }
        else {
          return element } })
    var truncatedPath = truncatePath(path)
    var editsPath = truncatedPath.concat('edits')
    var list = get(tree, editsPath)
    if (list === undefined) {
      list = [ ]
      setp(tree, editsPath, list) }
    var clone = {
      op: element.op,
      path: path
        .slice(truncatedPath.length)
        .filter(function(element) {
          return ( element !== 'splits' ) }) }
    if (element.value) {
      clone.value = element.value }
    list.push(clone) })
  return tree }

function truncatePath(path) {
  var truncated = path
  var length = path.length
  if (
    length >= 2 &&
    penultimate(path) === 'splits' )
  { truncated = path.slice(0, -2) }
  if (
    truncated.length >= 2 &&
    penultimate(truncated) === 'content' )
  { truncated = truncated.slice(0, -1) }
  return truncated }

function penultimate(list) {
  return list[list.length - 2] }
