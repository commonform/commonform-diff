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
        value: 'b' } ],
    'replaces content string')

  test.same(
    diff(
      { content: [ { use: 'Buyer'     }, ' buys.' ] },
      { content: [ { use: 'Purchaser' }, ' buys.' ] }),
    [ { operation: 'remove',
        path: [ 'content', 0 ] },
      { operation: 'add',
        path: [ 'content', 0 ],
        value: { use: 'Purchaser' } } ],
    'replaces term use')

  test.same(
    diff(
      { content: [ { definition: 'Buyer' }, ' buys.' ] },
      { content: [ { use:        'Buyer' }, ' buys.' ] }),
    [ { operation: 'remove',
        path: [ 'content', 0 ] },
      { operation: 'add',
        path: [ 'content', 0 ],
        value: { use: 'Buyer' } } ],
    'replaces definition')

  test.same(
    diff(
      { content: [ { use: 'Buyer' }, ' pays $5.' ] },
      { content: [ { use: 'Buyer' }, ' pays ', { blank: '' }, '.' ] }),
    [ { operation: 'add',
        path: [ 'content', 1 ],
        value: ' pays ' },
      { operation: 'add',
        path: [ 'content', 2 ],
        value: { blank: '' } },
      { operation: 'remove',
        path: [ 'content', 3] },
      { operation: 'add',
        path: [ 'content', 3 ],
        value: '.' } ],
    'replaces string with strings and blank')

  test.same(
    diff(
      { content: [
        { form: { content: [ 'A' ] } },
        { form: { content: [ 'B' ] } },
        { form: { content: [ 'C' ] } } ] },
      { content: [
        { form: { content: [ 'A' ] } },
        { form: { content: [ 'C' ] } },
        { form: { content: [ 'C' ] } } ] }),
    [ { operation: 'remove',
        path: [ 'content', 1, 'form', 'content', 0 ] },
      { operation: 'add',
        path: [ 'content', 1, 'form', 'content', 0],
        value: 'C' } ],
    'replaces child text')

  test.same(
    diff(
      { content: [
        { form: { content: [ 'A' ] } },
        { form: { content: [ 'C' ] } } ] },
      { content: [
        { form: { content: [ 'A' ] } },
        { form: { content: [ 'B' ] } },
        { form: { content: [ 'C' ] } } ] }),
    [ { operation: 'add',
        path: [ 'content', 1 ],
        value: { form: { content: [ 'B' ] } } } ],
    'adds missing child')

  test.same(
    diff(
      { content: [
        { form: { content: [ 'A' ] } },
        { form: { content: [ 'B' ] } },
        { form: { content: [ 'C' ] } } ] },
      { content: [
        { form: { content: [ 'A' ] } },
        { form: { content: [ 'C' ] } } ] }),
    [ { operation: 'remove',
        path: [ 'content', 1 ] } ],
    'removes extra child')
  test.end() })
