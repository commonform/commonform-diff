```javascript
var tape = require('tape')
var diff = require('commonform-diff')

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

  test.end() })
```
