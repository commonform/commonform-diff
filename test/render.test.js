var tape = require('tape')
var render = require('../')

tape('render', function(test) {

  test.same(
    render(
      { content: [ 'a b c' ] },
      { content: [ 'a d' ] })
      .content,
    [ { word: 'a' },
      { word: ' ' },
      { word: 'b', deleted: true },
      { word: ' ', deleted: true },
      { word: 'c', deleted: true },
      { word: 'd', inserted: true } ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A C' ] })
      .content,
    [ { word: 'A' },
      { word: ' ' },
      { word: 'B', deleted: true },
      { word: ' ', deleted: true },
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
      { word: ' ', inserted: true },
      { word: 'D', inserted: true } ])

  test.same(
    render(
      { content: [ { use: 'Seller' } , ' pays.' ] },
      { content: [ { use: 'Buyer' } , ' pays.' ] })
      .content,
    [ { use: 'Seller', deleted: true },
      { use: 'Buyer', inserted: true },
      { word: ' ' },
      { word: 'pays' },
      { word: '.' } ])

  test.same(
    render(
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] },
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] })
      .content,
    [ { use: 'Seller', deleted: true },
      { word: 'The', inserted: true },
      { word: ' ', inserted: true },
      { use: 'Buyer', inserted: true },
      { word: ' ' },
      { word: 'shall' },
      { word: ' ' },
      { word: 'pay' },
      { word: ' ' },
      { word: 'all', deleted: true },
      { word: 'no', inserted: true },
      { word: ' ' },
      { word: 'tax' },
      { word: '.' } ])

  test.same(
    render(
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] },
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] })
      .content,
    [ { word: 'The', deleted: true },
      { word: ' ', deleted: true },
      { use: 'Buyer', deleted: true },
      { use: 'Seller', inserted: true },
      { word: ' ' },
      { word: 'shall' },
      { word: ' ' },
      { word: 'pay' },
      { word: ' ' },
      { word: 'no', deleted: true },
      { word: 'all', inserted: true },
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
                { word: 'b', deleted: true },
                { word: ' ', deleted: true },
                { word: 'c', deleted: true },
                { word: 'd', inserted: true } ] } } ])

  test.same(
    render(
      { content: [ 'a b c' ] },
      { content: [ 'a x c' ] })
      .content,
    [ { word: 'a' },
      { word: ' ' },
      { word: 'b', deleted: true },
      { word: 'x', inserted: true },
      { word: ' ' },
      { word: 'c' } ])

  test.same(
    render(
      { content: [ 'Hello ', { form: { content: [ 'a b c' ] } } ] },
      { content: [ { form: { content: [ 'a d' ]   } } ] })
      .content,
    [ { word: 'Hello', deleted: true },
      { word: ' ', deleted: true },
      { form:
          { content:
              [ { word: 'a' },
                { word: ' ' },
                { word: 'b', deleted: true },
                { word: ' ', deleted: true },
                { word: 'c', deleted: true },
                { word: 'd', inserted: true } ] } } ])

  test.same(
    render(
      { content: [ 'This is just a test.' ] },
      { content: [ 'This is an important provision.' ] })
      .content,
    [ { word: 'This' },
      { word: ' ' },
      { word: 'is' },
      { word: ' ' },
      { word: 'just', deleted: true },
      { word: ' ', deleted: true },
      { word: 'a', deleted: true },
      { word: ' ', deleted: true },
      { word: 'test', deleted: true },
      { word: 'an', inserted: true },
      { word: ' ', inserted: true },
      { word: 'important', inserted: true },
      { word: ' ', inserted: true },
      { word: 'provision', inserted: true },
      { word: '.' } ])

  test.same(
    render(
      { content: [ 'The ', { use: 'Buyer' }, ' pays all tax.' ] },
      { content: [ 'The ', { use: 'Seller' }, ' withholds all tax.' ] })
      .content,
    [ { word: 'The' },
      { word: ' ' },
      { use: 'Buyer', deleted: true },
      { word: ' ', deleted: true },
      { word: 'pays', deleted: true },
      { use: 'Seller', inserted: true },
      { word: ' ', inserted: true },
      { word: 'withholds', inserted: true },
      { word: ' ' },
      { word: 'all' },
      { word: ' ' },
      { word: 'tax' },
      { word: '.' } ])

  test.same(
    render(
      { content: [ { heading: 'List of Words', form: { content: [ 'a b c' ] } } ] },
      { content: [ { heading: 'List of Items', form: { content: [ 'a b c' ] } } ] })
      .content,
    [ { heading:
          [ { word: 'List' },
            { word: ' ' },
            { word: 'of' },
            { word: ' ' },
            { word: 'Words', deleted: true },
            { word: 'Items', inserted: true } ],
        form: {
          content:
            [ { word: 'a' },
              { word: ' ' },
              { word: 'b' },
              { word: ' ' },
              { word: 'c' } ] } } ])

  test.same(
    render(
      { content: [ 'a b c d' ] },
      { content: [ 'a x y z' ] })
      .content,
    [ { word: 'a' },
      { word: ' ' },
      { word: 'b', deleted: true },
      { word: ' ', deleted: true },
      { word: 'c', deleted: true },
      { word: ' ', deleted: true },
      { word: 'd', deleted: true },
      { word: 'x', inserted: true },
      { word: ' ', inserted: true },
      { word: 'y', inserted: true },
      { word: ' ', inserted: true },
      { word: 'z', inserted: true } ])

  test.end() })
