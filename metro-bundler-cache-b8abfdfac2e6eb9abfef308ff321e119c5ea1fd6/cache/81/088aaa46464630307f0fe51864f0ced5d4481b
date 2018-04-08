'use strict';

var enhanceError = require('./enhanceError');

module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};