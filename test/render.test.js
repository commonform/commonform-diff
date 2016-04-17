var tape = require('tape')
var render = require('../render')

tape('render', function(test) {

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A D' ] }),
    [ { splits:
          [ { text: 'A' },
            { text: ' ' },
            { text: 'B', del: true},
            { text: ' ', del: true},
            { text: 'D', ins: true},
            { text: 'C', del: true} ] } ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A C' ] }),
    [ { splits:
          [ { text: 'A' },
            { text: ' ' },
            { text: 'B', del: true},
            { text: ' ', del: true},
            { text: 'C' } ] } ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A B C D' ] }),
    [ { splits:
          [ { text: 'A' },
            { text: ' ' },
            { text: 'B' },
            { text: ' ' },
            { text: 'C' },
            { text: ' ', ins: true },
            { text: 'D', ins: true } ] } ])

  test.same(
    render(
      { content: [ { use: 'Seller' } , ' pays.' ] },
      { content: [ { use: 'Buyer' } , ' pays.' ] }),
    [ { use: 'Buyer', ins: true },
      { use: 'Seller', del: true },
      { splits:
          [ { text: ' ' },
            { text: 'pays' },
            { text: '.' } ] } ])

  test.same(
    render(
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] },
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] }),
    [ { splits:
          [ { text: 'The' },
            { text: ' ' } ],
        ins: true },
      { use: 'Buyer', ins: true },
      { use: 'Seller', del: true },
      { splits:
          [ { text: ' ' },
            { text: 'shall' },
            { text: ' ' },
            { text: 'pay' },
            { text: ' ' },
            { text: 'no', ins: true },
            { text: 'all', del: true},
            { text: ' ' },
            { text: 'tax' },
            { text: '.' } ] } ])

  test.same(
    render(
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] },
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] }),
    [ { splits:
          [ { text: 'The' },
            { text: ' ' } ],
        del: true },
      { use: 'Seller', ins: true },
      { use: 'Buyer', del: true },
      { splits:
          [ { text: ' ' },
            { text: 'shall' },
            { text: ' ' },
            { text: 'pay' },
            { text: ' ' },
            { text: 'all', ins: true},
            { text: 'no', del: true },
            { text: ' ' },
            { text: 'tax' },
            { text: '.' } ] } ])

  test.end() })
