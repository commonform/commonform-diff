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

  test.end() })
