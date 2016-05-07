var tape = require('tape')
var render = require('../render')

tape('render', function(test) {

  test.same(
    render(
      { content: [ 'a b c' ] },
      { content: [ 'a d' ] })
      .content,
    [ { word: 'a' },
      { word: ' ' },
      { word: 'b', del: true },
      { word: ' ', del: true },
      { word: 'c', del: true },
      { word: 'd', ins: true } ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A C' ] })
      .content,
    [ { word: 'A' },
      { word: ' ' },
      { word: 'B', del: true },
      { word: ' ', del: true },
      { word: 'C' } ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A B C D' ] })
      .content,
    [ { word: 'A' },
      { word: ' ' },
      { word: 'B' },
      { word: ' ' },
      { word: 'C' },
      { word: ' ', ins: true },
      { word: 'D', ins: true } ])

  test.same(
    render(
      { content: [ { use: 'Seller' } , ' pays.' ] },
      { content: [ { use: 'Buyer' } , ' pays.' ] })
      .content,
    [ { use: 'Seller', del: true },
      { use: 'Buyer', ins: true },
      { word: ' ' },
      { word: 'pays' },
      { word: '.' } ])

  test.same(
    render(
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] },
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] })
      .content,
    [ { use: 'Seller', del: true },
      { word: 'The', ins: true },
      { word: ' ' },
      { use: 'Buyer', ins: true },
      { word: ' ', ins: true },
      { word: 'shall' },
      { word: ' ' },
      { word: 'pay' },
      { word: ' ' },
      { word: 'all', del: true },
      { word: 'no', ins: true },
      { word: ' ' },
      { word: 'tax' },
      { word: '.' } ])

  test.same(
    render(
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] },
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] })
      .content,
    [ { word: 'The', del: true },
      { use: 'Seller', ins: true },
      { word: ' ' },
      { use: 'Buyer', del: true },
      { word: ' ', del: true },
      { word: 'shall' },
      { word: ' ' },
      { word: 'pay' },
      { word: ' ' },
      { word: 'no', del: true },
      { word: 'all', ins: true },
      { word: ' ' },
      { word: 'tax' },
      { word: '.' } ])

  test.same(
    render(
      { content: [ { form: { content: [ 'a b c' ] } } ] },
      { content: [ { form: { content: [ 'a d' ]   } } ] })
      .content,
    [ { form:
          { content:
              [ { word: 'a' },
                { word: ' ' },
                { word: 'b', del: true },
                { word: ' ', del: true },
                { word: 'c', del: true },
                { word: 'd', ins: true } ] } } ])

  test.same(
    render(
      { content: [ 'a b c' ] },
      { content: [ 'a x c' ] })
      .content,
    [ { word: 'a' },
      { word: ' ' },
      { word: 'b', del: true },
      { word: 'x', ins: true },
      { word: ' ' },
      { word: 'c' } ])

  test.same(
    render(
      { content: [ 'Hello ', { form: { content: [ 'a b c' ] } } ] },
      { content: [ { form: { content: [ 'a d' ]   } } ] })
      .content,
    [ { word: 'Hello', del: true },
      { word: ' ', del: true },
      { form:
          { content:
              [ { word: 'a' },
                { word: ' ' },
                { word: 'b', del: true },
                { word: ' ', del: true },
                { word: 'c', del: true },
                { word: 'd', ins: true } ] } } ])

  test.same(
    render(
      { content: [ 'This is just a test.' ] },
      { content: [ 'This is an important provision.' ] })
      .content,
    [ { word: 'This' },
      { word: ' ' },
      { word: 'is' },
      { word: ' ' },
      { word: 'just', del: true },
      { word: 'an', ins: true },
      { word: ' ' },
      { word: 'a', del: true },
      { word: 'important', ins: true },
      { word: ' ' },
      { word: 'test', del: true },
      { word: 'provision', ins: true },
      { word: '.' } ])

  test.same(
    render(
      { content: [ 'The ', { use: 'Buyer' }, ' pays all tax.' ] },
      { content: [ 'The ', { use: 'Seller' }, ' withholds all tax.' ] })
      .content,
    [ { word: 'The' },
      { word: ' ' },
      { use: 'Buyer', del: true },
      { use: 'Seller', ins: true },
      { word: ' ' },
      { word: 'pays', del: true },
      { word: 'withholds', ins: true },
      { word: ' ' },
      { word: 'all' },
      { word: ' ' },
      { word: 'tax' },
      { word: '.' } ])

  test.end() })
