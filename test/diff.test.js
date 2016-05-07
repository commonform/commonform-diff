var tape = require('tape')
var diff = require('../')

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
