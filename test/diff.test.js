var tape = require('tape')
var diff = require('../')

tape('diff', function(test) {

  test.same(
    diff(
      { content: [ 'A' ] },
      { content: [ 'B' ] }),
    [ { action: 'replace',
        path: '/content/0/splits/0',
        value: 'B' } ])

  test.same(
    diff(
      { content: [ 'A B C' ] },
      { content: [ 'A C' ] }),
    [ { action: 'remove',
        path: '/content/0/splits/2' },
      { action: 'remove',
        path: '/content/0/splits/2' } ])

  test.same(
    diff(
      { content: [ 'A B C D E' ] },
      { content: [ 'A X C Y E' ] }),
    [ { action: 'replace',
        path: '/content/0/splits/2',
        value: 'X' },
      { action: 'replace',
        path: '/content/0/splits/6',
        value: 'Y' } ])

  test.same(
    diff(
      { content: [ 'A B C' ] },
      { content: [ 'A D' ] }),
    [ { action: 'remove',
        path: '/content/0/splits/2' },
      { action: 'remove',
        path: '/content/0/splits/2' },
      { action: 'replace',
        path: '/content/0/splits/2',
        value: 'D' } ])

  test.end() })
