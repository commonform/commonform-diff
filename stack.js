/*
Copyright 2016 Kyle E. Mitchell

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

module.exports = stack

// Stack replacements separated only by whitespace.
//
// Turns:
//
//     [
//       {word: 'a', deleted: true },
//       {word: 'x', inserted: true},
//       {word: ' '                },
//       {word: 'b', deleted: true },
//       {word: 'y', inserted: true}
//     ]
//
// into:
//
//     [
//       {word: 'a', deleted: true },
//       {word: ' ', deleted: true },
//       {word: 'b', deleted: true },
//       {word: 'x', inserted: true},
//       {word: ' ', inserted: true},
//       {word: 'y', inserted: true}
//     ]
//
// for easier reading.
function stack (diff) {
  var newContent = [] // New array for diff.content.
  var content = diff.content // The original, unstacked content array.

  // A buffer to hold insertions.  Once we see an insertion, we start
  // buffering all insertions that follow, until we hit common text.  At
  // that point, we flush the buffered insertions to `newContent`.
  var insertionsBuffer = []
  function flush () {
    var length = insertionsBuffer.length
    if (length !== 0) {
      var lastInsertion = insertionsBuffer[length - 1]
      var trailingSpace = (lastInsertion.word === ' ')
      // If there was a space before the common text that causes us to
      // flush the insertions buffer, it will have been buffered, but we
      // should just show it as common text.
      if (trailingSpace) {
        newContent.pop()
        insertionsBuffer.pop()
      }
      // Push elements of `insertionsBuffer` to `newContent`.
      insertionsBuffer.forEach(function (element) {
        newContent.push(element)
      })
      // If there was a trailing common space, it should _follow_ the
      // flushed insertions in the new content array.
      if (trailingSpace) {
        newContent.push({word: ' '})
      }
      // Clear the buffer array.
      insertionsBuffer = []
    }
  }

  content.forEach(function (element) {
    var deleted = element.hasOwnProperty('deleted')
    var inserted = element.hasOwnProperty('inserted')
    var common = !deleted && !inserted
    var buffering = insertionsBuffer.length !== 0
    var isSpace = (
      element.hasOwnProperty('word') &&
      element.word === ' '
    )
    // Apply recursively to child forms.
    if (element.hasOwnProperty('form')) {
      stack(element.form)
    }
    if (buffering) {
      if (common && isSpace) {
        insertionsBuffer.push({word: ' ', inserted: true})
        newContent.push({word: ' ', deleted: true})
      } else if (inserted) {
        insertionsBuffer.push(element)
      } else if (deleted) {
        newContent.push(element)
      } else {
        flush()
        newContent.push(element)
      }
    } else /* if (!buffering) */ {
      if (inserted) {
        insertionsBuffer.push(element)
      } else /* if (deleted || common) */ {
        newContent.push(element)
      }
    }
  })

  flush()

  diff.content = newContent
  return diff
}
