var tape = require('tape')
var render = require('../render')

tape('render', function(test) {

  test.same(
    render(
      { content: [ 'a b c' ] },
      { content: [ 'a d' ] })
      .content,
    [ { splits:
          [ { text: 'a' },
            { text: ' ' },
            { text: 'b', del: true},
            { text: ' ', del: true},
            { text: 'c', del: true},
            { text: 'd', ins: true} ] } ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A C' ] })
      .content,
    [ { splits:
          [ { text: 'A' },
            { text: ' ' },
            { text: 'B', del: true},
            { text: ' ', del: true},
            { text: 'C' } ] } ])

  test.same(
    render(
      { content: [ 'A B C' ] },
      { content: [ 'A B C D' ] })
      .content,
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
      { content: [ { use: 'Buyer' } , ' pays.' ] })
      .content,
    [ { use: 'Seller', del: true },
      { use: 'Buyer', ins: true },
      { splits:
          [ { text: ' ' },
            { text: 'pays' },
            { text: '.' } ] } ])

  test.same(
    render(
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] },
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] })
      .content,
    [ { splits:
          [ { text: 'The' },
            { text: ' ' } ],
        ins: true },
      { use: 'Seller', del: true },
      { use: 'Buyer', ins: true },
      { splits:
          [ { text: ' ' },
            { text: 'shall' },
            { text: ' ' },
            { text: 'pay' },
            { text: ' ' },
            { text: 'all', del: true},
            { text: 'no', ins: true },
            { text: ' ' },
            { text: 'tax' },
            { text: '.' } ] } ])

  test.same(
    render(
      { content: [ 'The ', { use: 'Buyer' } , ' shall pay no tax.' ] },
      { content: [ { use: 'Seller' } , ' shall pay all tax.' ] })
      .content,
    [ { splits:
          [ { text: 'The' },
            { text: ' ' } ],
        del: true },
      { use: 'Buyer', del: true },
      { use: 'Seller', ins: true },
      { splits:
          [ { text: ' ' },
            { text: 'shall' },
            { text: ' ' },
            { text: 'pay' },
            { text: ' ' },
            { text: 'no', del: true },
            { text: 'all', ins: true},
            { text: ' ' },
            { text: 'tax' },
            { text: '.' } ] } ])

  test.same(
    render(
      { content: [ { form: { content: [ 'a b c' ] } } ] },
      { content: [ { form: { content: [ 'a d' ]   } } ] })
      .content,
    [ { form:
          { content:
              [ { splits:
                  [ { text: 'a' },
                    { text: ' ' },
                    { text: 'b', del: true },
                    { text: ' ', del: true },
                    { text: 'c', del: true },
                    { text: 'd', ins: true } ] } ] } } ])

  test.same(
    render(
      { content: [ 'a b c' ] },
      { content: [ 'a x c' ] })
      .content,
    [ { splits:
        [ { text: 'a' },
          { text: ' ' },
          { text: 'b', del: true },
          { text: 'x', ins: true },
          { text: ' ' },
          { text: 'c' } ] } ])

  test.same(
    render(
      { content: [ 'Hello ', { form: { content: [ 'a b c' ] } } ] },
      { content: [ { form: { content: [ 'a d' ]   } } ] })
      .content,
    [ { splits:
          [ { text: 'Hello' },
            { text: ' ' } ],
        del: true },
      { form:
          { content:
              [ { splits:
                    [ { text: 'a' },
                      { text: ' ' },
                      { text: 'b', del: true },
                      { text: ' ', del: true },
                      { text: 'c', del: true },
                      { text: 'd', ins: true } ] } ] } } ])

  test.end() })
