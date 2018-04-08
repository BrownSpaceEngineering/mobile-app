

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DeviceEventManager = require('NativeModules').DeviceEventManager;
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

var DEVICE_BACK_EVENT = 'hardwareBackPress';

var _backPressSubscriptions = new Set();

RCTDeviceEventEmitter.addListener(DEVICE_BACK_EVENT, function () {
  var backPressSubscriptions = new Set(_backPressSubscriptions);
  var invokeDefault = true;
  var subscriptions = [].concat(_toConsumableArray(backPressSubscriptions)).reverse();
  for (var i = 0; i < subscriptions.length; ++i) {
    if (subscriptions[i]()) {
      invokeDefault = false;
      break;
    }
  }

  if (invokeDefault) {
    BackHandler.exitApp();
  }
});

var BackHandler = {

  exitApp: function exitApp() {
    DeviceEventManager.invokeDefaultBackPressHandler();
  },

  addEventListener: function addEventListener(eventName, handler) {
    _backPressSubscriptions.add(handler);
    return {
      remove: function remove() {
        return BackHandler.removeEventListener(eventName, handler);
      }
    };
  },

  removeEventListener: function removeEventListener(eventName, handler) {
    _backPressSubscriptions.delete(handler);
  }

};

module.exports = BackHandler;