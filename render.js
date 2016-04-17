module.exports = render

var diff = require('./')
var get = require('keyarray-get')
var splitStrings = require('./split-strings')
var splitWords=  require('./split-words')
var treeify = require('./treeify-patch')

function render(a, b) {
  var editTree = treeify(diff(a, b, splitStrings))
  return renderForm(a, editTree) }

function renderForm(form, editTree) {
  var original = form.content.reduce(
    function(returned, element, index) {
      if (typeof element === 'string') {
        returned.push(renderText(element))
        return returned }
      else if (element.hasOwnProperty('form')) {
        return returned.concat(
          renderForm(
            element.form,
            get(editTree, [ 'content', index, 'form' ], [ ]))) }
      else {
        return returned.concat(element) } },
    [ ])
  var editsHere = get(editTree, [ 'content', 'edits' ], [ ])
  return editsHere
    .reduce(applyOperation, original) }

function applyOperation(returned, operation) {
  var op = operation.op
  var path = operation.path
  var value = operation.value
  var contentElementIndex = getNth(returned, path[0])
  var contentElement = returned[contentElementIndex]
  var splitIndex
  if (op === 'remove') {
    if (path.length === 2) {
      splitIndex = getNth(contentElement.splits, path[1])
      contentElement.splits[splitIndex].del = true }
    else {
      contentElement.del = true } }
  else if (op === 'add') {
    if (path.length === 2) {
      splitIndex = getNth(contentElement.splits, path[1])
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
    if (path.length === 2) {
      splitIndex = getNth(contentElement.splits, path[1])
      var split = contentElement.splits[splitIndex]
      split.del = true
      contentElement.splits.splice(
        splitIndex, 0, { text: value, ins: true }) }
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
