

'use strict';

var NativeModules = require('NativeModules');

var Platform = {
  OS: 'android',
  get Version() {
    var constants = NativeModules.PlatformConstants;
    return constants && constants.Version;
  },
  get isTesting() {
    var constants = NativeModules.PlatformConstants;
    return constants && constants.isTesting;
  },
  select: function select(obj) {
    return 'android' in obj ? obj.android : obj.default;
  }
};

module.exports = Platform;