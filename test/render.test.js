var tape = require('tape')
var render = require('../render')

tape('render', function(test) {

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A D' ] }),
    [ [ { text: 'A' },
        { text: ' ' },
        { text: 'B', del: true},
        { text: ' ', del: true},
        { text: 'D', ins: true},
        { text: 'C', del: true} ] ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A C' ] }),
    [ [ { text: 'A' },
        { text: ' ' },
        { text: 'B', del: true},
        { text: ' ', del: true},
        { text: 'C' } ] ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A B C D' ] }),
    [ [ { text: 'A' },
        { text: ' ' },
        { text: 'B' },
        { text: ' ' },
        { text: 'C' },
        { text: ' ', ins: true },
        { text: 'D', ins: true } ] ])

  test.end() })
