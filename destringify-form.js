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

module.exports = destringifyForm

var destringify = require('./destringify')

function destringifyForm(form) {
  form.content = form.content.map(function(element) {
    if (typeof element === 'string') {
      return destringify(element) }
    else {
      destringifyForm(element.form)
      element.heading = element.heading.map(destringify)
      element.conspicuous = element.conspicuous.map(destringify)
      return element } }) }
