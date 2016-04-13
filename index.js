module.exports = diff

var pointer = require('json-pointer')
var rfc = require('rfc6902-json-diff')

function diff(a, b) {
  return rfc(a, b)

    .reduce(
      function splitResolves(result, element) {
        if (element.op === 'replace') {
          return result.concat(
            { op: 'remove',
              path: element.path },
            { op: 'add',
              path: element.path,
              value: element.value }) }
        else {
          return result.concat(element) } },
      [ ])

    .map(function parsePointers(element) {
      var returned = {
        operation: element.op,
        path: pointer.parse(element.path)
          .map(function(element) {
            return ( isNaN(element) ? element : parseInt(element) ) }) }
      if (element.value) {
        returned.value = element.value }
      return returned })

    .map(function resolveToContentElements(element) {
      var path = element.path
      while (typeof path[path.length - 1] === 'string') {
        var lastKey = path.pop()
        if ('value' in element) {
          var oldValue = element.value
          element.value = { }
          element.value[lastKey] = oldValue } }
      return element })

    .reduce(
      function(groups, element) {
        var path = element.path
        var prefix = path.slice(0, -1).join('/')
        var prefixGroup
        var length = groups.length
        for (var index = 0; index < length; index++) {
          var group = groups[index]
          if (group.prefix === prefix) {
            prefixGroup = group
            break } }
        if (!prefixGroup) {
          prefixGroup = {
            prefix: prefix,
            operations: [ ] }
          groups.push(prefixGroup) }
        prefixGroup.operations.push(element)
        return groups },
      [ ])

    .map(function(group) {
      return group.operations
        .reduce(
          function(result, element) {
            // Rearrange any delete operations to move them head of add
            // operations, adjusting operation paths as necessary to reflect
            // the new order in which operations will be applied and their
            // effect on array offsets within the content array.
            return result.concat(element) },
          [ ]) })

    .reduce(
      function(flattened, group) {
        return flattened.concat(group) },
      [ ]) }
