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

module.exports = splitStrings

var splitWords = require('./split-words')
var stringify = require('./stringify')

function splitStrings(argument) {
  var returned = { }
  returned.content = argument.content
    .reduce(
      function(content, element) {
        if (typeof element === 'string') {
          return content.concat(
            splitWords(element)
              .map(function(word) {
                return stringify('w', word) })) }
        else if (element.hasOwnProperty('form')) {
          var child = { }
          if (element.hasOwnProperty('heading')) {
            child.heading = element.heading }
          child.form = splitStrings(element.form)
          if (element.hasOwnProperty('heading')) {
            child.heading = splitWords(element.heading)
              .map(function(word) {
                return stringify('w', word) }) }
          return content.concat(child) }
        else {
          var stringified
          if (element.hasOwnProperty('use')) {
            stringified = stringify('u', element.use) }
          else if (element.hasOwnProperty('definition')) {
            stringified = stringify('d', element.definition) }
          else if (element.hasOwnProperty('reference')) {
            stringified = stringify('r', element.reference) }
          else if (element.hasOwnProperty('blank')) {
            stringified = stringify('b', '') }
          return content.concat(stringified) } },
      [ ])
  if (argument.conspicuous) {
    returned.conspicuous = argument.conspicuous }
  return returned }
