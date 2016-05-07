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

module.exports = stack

function stack(rendering) {
  var newContent = [ ]
  var content = rendering.content

  // Buffer for insertions
  var insertionsBuffer = [ ]
  function flush() {
    var length = insertionsBuffer.length
    if (length != 0) {
      var lastInsertion = insertionsBuffer[length - 1]
      var trailingSpace = ( lastInsertion.word === ' ' )
      if (trailingSpace) {
        newContent.pop()
        insertionsBuffer.pop() }
      insertionsBuffer.forEach(function(element) {
        newContent.push(element) })
      if (trailingSpace) {
        newContent.push({ word: ' ' }) }
      insertionsBuffer = [ ] } }

  content.forEach(function(element) {
    var deleted = element.hasOwnProperty('deleted')
    var inserted = element.hasOwnProperty('inserted')
    var common = ( !deleted && !inserted )
    var buffering = ( insertionsBuffer.length != 0 )
    var isSpace = (
      element.hasOwnProperty('word') &&
      element.word === ' ' )
    if (element.hasOwnProperty('form')) {
      stack(element.form) }
    if (buffering) {
      if (common && isSpace) {
        insertionsBuffer.push({ word: ' ', inserted: true })
        newContent.push({ word: ' ', deleted: true }) }
      else if (inserted) {
        insertionsBuffer.push(element) }
      else if (deleted) {
        newContent.push(element) }
      else {
        flush()
        newContent.push(element) } }
    else /* if (!buffering) */ {
      if (inserted) {
        insertionsBuffer.push(element) }
      else /* if (deleted || common) */ {
        newContent.push(element) } } })

  flush()

  rendering.content = newContent
  return rendering }
