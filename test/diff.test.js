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
var diff = require('../diff')

tape('diff', function(test) {

  test.same(
    diff(
      { content: [ 'A' ] },
      { content: [ 'B' ] }),
    [ { op: 'replace',
        path: '/content/0',
        value: 'w:B' } ])

  test.same(
    diff(
      { content: [ 'A B C' ] },
      { content: [ 'A C' ] }),
    [ { op: 'remove',
        path: '/content/2' },
      { op: 'remove',
        path: '/content/2' } ])

  test.same(
    diff(
      { content: [ 'A B C D E' ] },
      { content: [ 'A X C Y E' ] }),
    [ { op: 'replace',
        path: '/content/2',
        value: 'w:X' },
      { op: 'replace',
        path: '/content/6',
        value: 'w:Y' } ])

  test.same(
    diff(
      { content: [ 'A B C' ] },
      { content: [ 'A D' ] }),
    [ { op: 'remove',
        path: '/content/2' },
      { op: 'remove',
        path: '/content/2' },
      { op: 'replace',
        path: '/content/2',
        value: 'w:D' } ])

  test.end() })
