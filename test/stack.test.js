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

var tape = require('tape')
var stack = require('../stack')

tape('stack', function(test) {

  test.same(
    stack(
      { content:
          [ { word: 'a' },
            { word: ' ', inserted: true},
            { word: 'b', inserted: true } ] })
      .content,
          [ { word: 'a' },
            { word: ' ', inserted: true},
            { word: 'b', inserted: true } ])

  test.same(
    stack(
      { content:
          [ { word: 'a' },
            { word: ' ' },
            { word: 'b', deleted: true },
            { word: 'x', inserted: true },
            { word: ' ' },
            { word: 'c', deleted: true },
            { word: 'y', inserted: true },
            { word: ' ' },
            { word: 'd' } ] })
      .content,
          [ { word: 'a' },
            { word: ' ' },
            { word: 'b', deleted: true },
            { word: ' ', deleted: true },
            { word: 'c', deleted: true },
            { word: 'x', inserted: true },
            { word: ' ', inserted: true },
            { word: 'y', inserted: true },
            { word: ' ' },
            { word: 'd' } ])

  test.end() })
