module.exports = destringifyForm

var destringify = require('./destringify')

function destringifyForm(form) {
  form.content = form.content.map(function(element) {
    if (typeof element === 'string') {
      return destringify(element) }
    else {
      destringifyForm(element.form)
      if (element.hasOwnProperty('heading')) {
        element.heading = element.heading
          .map(function(word) {
            return destringify(word) }) }
      return element } }) }
