module.exports = render

var diff = require('./')
var get = require('keyarray-get')
var splitStrings = require('./split-strings')
var splitWords=  require('./split-words')
var treeify = require('./treeify-patch')

function render(a, b) {
  var editTree = treeify(diff(a, b, splitStrings))
  return renderForm([ ], a, editTree.content) }

function renderForm(path, form, editTree) {
  var original = form.content.reduce(
    function(returned, element, index) {
      if (typeof element === 'string') {
        returned.push(renderText(element))
        return returned }
      else if (element.hasOwnProperty('form')) {
        var childPath = path.concat(index)
        var childEditTree = get(editTree, childPath, [ ])
        return returned.concat(
          renderForm(childPath, element, childEditTree)) }
      else {
        return returned.concat(element) } },
    [ ])
  var editsHere = get(
    editTree,
    path.concat('edits'),
    [ ])
  return editsHere
    .reduce(
      function(returned, element) {
        var op = element.op
        var path = element.path
        var contentElementIndex = getNth(returned, path[0], true)
        var contentElement = returned[contentElementIndex]
        var splitIndex
        if (op === 'remove') {
          if (path.length === 2) {
            getNth(contentElement.splits, path[1]).del = true }
          else {
            contentElement.del = true } }
        else if (op === 'add') {
          if (path.length === 2) {
            splitIndex = getNth(contentElement.splits, path[1], true)
            contentElement.splits.splice(
              splitIndex, 0,
              { text: element.value, ins: true }) }
          else {
            if (element.value.hasOwnProperty('splits')) {
              var rendered = renderSplits(element.value.splits)
              rendered.ins = true
              returned.splice(contentElementIndex, 0, rendered) }
            else {
              element.value.ins = true
              returned.splice(contentElementIndex, 0, element.value) } } }
        else if (op === 'replace') {
          if (path.length === 2) {
            splitIndex = getNth(contentElement.splits, path[1], true)
            var split = contentElement.splits[splitIndex]
            split.del = true
            contentElement.splits.splice(
              splitIndex, 0, { text: element.value, ins: true }) }
          else {
            element.value.ins = true
            contentElement.del = true
            returned.splice(contentElementIndex, 0, element.value) } }
        return original },
      original) }

function renderText(text, edits) {
  return renderSplits(splitWords(text)) }

function renderSplits(splits) {
  return {
    splits: splits.map(function(split) {
      return { text: split } }) } }

function getNth(elements, target, returnIndex) {
  var length = elements.length
  var count = 0
  for (var index = 0; index < length; index++) {
    var element = elements[index]
    if (!element.hasOwnProperty('del')) {
      if (count === target) {
        return ( returnIndex ? index : element ) }
      count++ } }
  return ( index + 1 ) }
