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

module.exports = stringifyForm

var splitWords = require('./split-words')
var stringify = require('./stringify')

// Convert content objects like `{use: 'term'}` to strings like
// 'u:term', words like `{word: 'text'}` to `w:text`, and so on. That
// way, when objects are fed to the diff algorith, the diff solver
// weighs the total replacement of any word or content element the same.
function stringifyForm (form) {
  var returned = { }
  returned.content = form.content
  .reduce(function (content, element) {
    if (typeof element === 'string') {
      return content.concat(
        splitWords(element)
        .map(function (word) {
          return stringify('w', word)
        })
      )
    } else if (element.hasOwnProperty('form')) {
      var child = {
        heading: (
          element.hasOwnProperty('heading')
          ? splitWords(element.heading).map(function (word) {
            return stringify('w', word)
          })
          : []
        ),
        form: stringifyForm(element.form)
      }
      return content.concat(child)
    } else {
      var stringified
      if (element.hasOwnProperty('use')) {
        stringified = stringify('u', element.use)
      } else if (element.hasOwnProperty('definition')) {
        stringified = stringify('d', element.definition)
      } else if (element.hasOwnProperty('reference')) {
        stringified = stringify('r', element.reference)
      } else if (element.hasOwnProperty('blank')) {
        stringified = stringify('b', '')
      } return content.concat(stringified)
    }
  }, [])
  returned.conspicuous = form.hasOwnProperty('conspicuous')
  ? [stringify('w', form.conspicuous)]
  : []
  return returned
}
