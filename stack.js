module.exports = stack

function stack(rendering) {
  var newContent = [ ]
  var content = rendering.content

  // Buffer for insertions
  var insertionsBuffer = [ ]
  function flush() {
    var length = insertionsBuffer.length
    if (length != 0) {
      var lastInsertion = insertionsBuffer[length - 1]
      var trailingSpace = ( lastInsertion.word === ' ' )
      if (trailingSpace) {
        newContent.pop()
        insertionsBuffer.pop() }
      insertionsBuffer.forEach(function(element) {
        newContent.push(element) })
      if (trailingSpace) {
        newContent.push({ word: ' ' }) }
      insertionsBuffer = [ ] } }

  content.forEach(function(element) {
    var deleted = element.hasOwnProperty('deleted')
    var inserted = element.hasOwnProperty('inserted')
    var common = ( !deleted && !inserted )
    var buffering = ( insertionsBuffer.length != 0 )
    var isSpace = (
      element.hasOwnProperty('word') &&
      element.word === ' ' )
    if (element.hasOwnProperty('form')) {
      stack(element.form) }
    if (buffering) {
      if (common && isSpace) {
        insertionsBuffer.push({ word: ' ', inserted: true })
        newContent.push({ word: ' ', deleted: true }) }
      else if (inserted) {
        insertionsBuffer.push(element) }
      else if (deleted) {
        newContent.push(element) }
      else {
        flush()
        newContent.push(element) } }
    else /* if (!buffering) */ {
      if (inserted) {
        insertionsBuffer.push(element) }
      else /* if (deleted || common) */ {
        newContent.push(element) } } })

  flush()

  rendering.content = newContent
  return rendering }
