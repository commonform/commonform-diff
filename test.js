var tape = require('tape')
var diff = require('./')

tape(function(test) {

  test.same(
    diff(
      { content: [ 'a' ] },
      { content: [ 'b' ] }),
    [ { operation: 'remove',
        path: [ 'content', 0 ] },
      { operation: 'add',
        path: [ 'content', 0 ],
        value: 'b' } ])

  test.same(
    diff(
      { content: [ { use: 'Buyer'     }, ' buys.' ] },
      { content: [ { use: 'Purchaser' }, ' buys.' ] }),
    [ { operation: 'remove',
        path: [ 'content', 0 ] },
      { operation: 'add',
        path: [ 'content', 0 ],
        value: { use: 'Purchaser' } } ])

  test.same(
    diff(
      { content: [ { definition: 'Buyer' }, ' buys.' ] },
      { content: [ { use:        'Buyer' }, ' buys.' ] }),
    [ { operation: 'remove',
        path: [ 'content', 0 ] },
      { operation: 'add',
        path: [ 'content', 0 ],
        value: { use: 'Buyer' } } ])

  test.same(
    diff(
      { content: [ { use: 'Buyer' }, ' shall pay $5.' ] },
      { content: [ { use: 'Buyer' }, ' shall pay ',
                   { blank: '' }, '.' ] }),
    [ { operation: 'remove',
        path: [ 'content', 1 ] },
      { operation: 'add',
        path: [ 'content', 1 ],
        value: ' shall pay ' },
      { operation: 'add',
        path: [ 'content', 2 ],
        value: { blank: '' } },
      { operation: 'add',
        path: [ 'content', 3 ],
        value: '.' } ])

  test.end() })
