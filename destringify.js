module.exports = destringify

var expansions = {
  b: 'blank',
  d: 'definition',
  r: 'reference',
  u: 'use',
  w: 'word' }

function destringify(string) {
  var split = string.split(':', 2)
  var typeCode = split[0]
  var value = split[1]
  var object = { }
  object[expansions[typeCode]] = value
  return object }
