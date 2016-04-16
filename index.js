module.exports = commonformdiff

var diff = require('rfc6902-json-diff')
var pointer = require('json-pointer')
var defaultSplit = require('./split-strings')

function commonformdiff(a, b, split) {
  if (split === undefined) {
    split = defaultSplit }

  return diff(split(a), split(b))
    .map(parsePaths)
    // .reduce(replaceToRemoveThenAdd, [ ])
    // .map(removeToReplace)
    .map(actionify)
    .map(compilePaths) }

function actionify(operation) {
  var op = operation.op
  if (op === 'add') {
    return {
      action: 'insert',
      path: operation.path,
      value: operation.value } }
  else if (op === 'remove') {
    return {
      action: 'remove',
      path: operation.path } }
  else if (op === 'replace') {
    return {
      action: 'replace',
      path: operation.path,
      value: operation.value } } }

function removeToReplace(operation) {
  var path = operation.path
  var pathLength = path.length
  var splitRemoval = (
    ( operation.op === 'remove' ) &&
    ( pathLength > 2 ) &&
    ( path[pathLength - 2] === 'splits' ) )
  if (splitRemoval) {
    return {
      op: 'replace',
      path: path,
      value: '' } }
  else {
    return operation } }

// function replaceToRemoveThenAdd(result, element) {
//   if (element.op === 'replace') {
//     return result.concat(
//       { op: 'remove',
//         path: element.path },
//       { op: 'add',
//         path: element.path,
//         value: element.value }) }
//   else {
//     return result.concat(element) } }

function parsePaths(element) {
  element.path = pointer.parse(element.path)
  return element }

function compilePaths(element) {
  element.path = pointer.compile(element.path)
  return element }
