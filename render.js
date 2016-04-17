module.exports = render

var diff = require('./')
var get = require('keyarray-get')
var splitStrings = require('./split-strings')
var splitWords=  require('./split-words')
var treeify = require('./treeify-patch')

// Render a, showing edits from b.
function render(a, b) {
  var editTree =
    // Convert the array of operations to a tree the same shape as a.
    treeify(
      // Create a list of operations for converting a to b.
      diff(a, b, splitStrings))
  return renderForm(a, editTree) }

function renderForm(form, editTree) {
  // Render the content elements of this form.
  var original = form.content.reduce(
    function(returned, element, index) {
      if (typeof element === 'string') {
        returned.push(renderText(element))
        return returned }
      else if (element.hasOwnProperty('form')) {
        return returned.concat(
          renderForm(
            element.form,
            // Recurse down the tree of operations in parallel.
            get(editTree, [ 'content', index, 'form' ], [ ]))) }
      else {
        return returned.concat(element) } },
    [ ])
  // Find edits to be applied to the contnet elements of this form.
  var editsHere = get(editTree, [ 'content', 'edits' ], [ ])
  // Apply the operations to the rendered content elements.
  return editsHere.reduce(applyOperation, original) }

function applyOperation(returned, operation) {
  var op = operation.op
  var path = operation.path
  var value = operation.value
  // Find the index of the element to which the operation applies.
  var contentElementIndex = getNth(returned, path[0])
  // Find the lement itself.
  var contentElement = returned[contentElementIndex]
  // If the path has a second key element, it refers to a split within a string
  // content element.
  var splitIndex
  var splitElement
  var operationTargetsASplit = ( path.length === 2 )
  if (operationTargetsASplit) {
    splitIndex = getNth(contentElement.splits, path[1])
    splitElement = contentElement.splits[splitIndex] }
  if (op === 'remove') {
    if (operationTargetsASplit) {
      contentElement.splits[splitIndex].del = true }
    else {
      contentElement.del = true } }
  else if (op === 'add') {
    if (operationTargetsASplit) {
      contentElement.splits.splice(
        splitIndex, 0,
        { text: value, ins: true }) }
    else {
      if (value.hasOwnProperty('splits')) {
        var rendered = renderSplits(value.splits)
        rendered.ins = true
        returned.splice(contentElementIndex, 0, rendered) }
      else {
        value.ins = true
        returned.splice(contentElementIndex, 0, value) } } }
  else if (op === 'replace') {
    if (operationTargetsASplit) {
      splitElement.del = true
      var newSplit = { text: value, ins: true }
      contentElement.splits.splice(splitIndex, 0, newSplit) }
    else {
      value.ins = true
      contentElement.del = true
      returned.splice(contentElementIndex, 0, value) } }
  return returned }

function renderText(text) {
  return renderSplits(splitWords(text)) }

function renderSplits(splits) {
  return {
    splits: splits.map(function(split) {
      return { text: split } }) } }

// Return the array index of the nth contnet element that has _not_ been marked
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
