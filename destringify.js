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

module.exports = destringify

var expansions = {
  b: 'blank',
  d: 'definition',
  r: 'reference',
  u: 'use',
  w: 'word' }

function destringify(string) {
  var split = string.split(':', 2)
  var typeCode = split[0]
  var value = split[1]
  var object = { }
  object[expansions[typeCode]] = value
  return object }
