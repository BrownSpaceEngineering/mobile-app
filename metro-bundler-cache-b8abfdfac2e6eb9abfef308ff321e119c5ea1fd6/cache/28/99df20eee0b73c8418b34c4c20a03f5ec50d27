

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

function filterObject(object, callback, context) {
  if (!object) {
    return null;
  }
  var result = {};
  for (var name in object) {
    if (hasOwnProperty.call(object, name) && callback.call(context, object[name], name, object)) {
      result[name] = object[name];
    }
  }
  return result;
}

module.exports = filterObject;