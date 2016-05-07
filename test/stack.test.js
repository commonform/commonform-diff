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
