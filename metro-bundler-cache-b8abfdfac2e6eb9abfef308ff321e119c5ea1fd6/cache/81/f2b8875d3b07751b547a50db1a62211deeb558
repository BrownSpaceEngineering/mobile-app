
'use strict';

var NativeModules = require('NativeModules');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

var RCTAccessibilityInfo = NativeModules.AccessibilityInfo;

var TOUCH_EXPLORATION_EVENT = 'touchExplorationDidChange';

var _subscriptions = new Map();

var AccessibilityInfo = {

  fetch: function fetch() {
    return new Promise(function (resolve, reject) {
      RCTAccessibilityInfo.isTouchExplorationEnabled(function (resp) {
        resolve(resp);
      });
    });
  },

  addEventListener: function addEventListener(eventName, handler) {
    var listener = RCTDeviceEventEmitter.addListener(TOUCH_EXPLORATION_EVENT, function (enabled) {
      handler(enabled);
    });
    _subscriptions.set(handler, listener);
  },

  removeEventListener: function removeEventListener(eventName, handler) {
    var listener = _subscriptions.get(handler);
    if (!listener) {
      return;
    }
    listener.remove();
    _subscriptions.delete(handler);
  }

};

module.exports = AccessibilityInfo;