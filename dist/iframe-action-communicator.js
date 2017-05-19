'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function JSONstringify(value) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return false;
  }
}

function JSONparse(value) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return false;
  }
}

/**
 * @class IframeActionCommunicator
 * @example
 * ```
 * const com = new IFrameCommunicator();
 * com.on('ready', () => document.querySelector('root').style.backgroundColor = 'blue');
 * com.ready();
 * ```
 */

var IframeActionCommunicator = function () {
  function IframeActionCommunicator(iFrameID) {
    var _this = this;

    _classCallCheck(this, IframeActionCommunicator);

    this.$iFrame = null;
    this.registeredActions = {};

    if (iFrameID) {
      this.$iFrame = document.getElementById(iFrameID);
    }

    var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
    var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
    var listener = window[eventMethod];

    listener(messageEvent, function (e) {
      var message = JSONparse(e.data);
      var action = message.constructor === Object ? message.action : message;

      if (!action) return console.error(_this.constructor.name + ': Action mustn\'t be empty. Please, pass action like a string or like an object in key \'action\'');

      if (_this.registeredActions[action]) {
        if (message.constructor === Object) {
          _this.registeredActions[message.action](message.data);
        } else if (typeof message === 'string') {
          _this.registeredActions[action]();
        }
      } else {
        console.error(_this.constructor.name + ': Any handler doesn\'t subscribe on \'' + action + '\' action');
      }
    }, false);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @return {IFrameCommunicator}
   */


  _createClass(IframeActionCommunicator, [{
    key: 'post',
    value: function post(message) {
      if (!message || typeof message !== 'string' && message.constructor !== Object) {
        return console.error(this.constructor.name + ': post argument doesn\'t must empty and type me be \'string\' or \'object\'');
      }

      var stringMessage = JSONstringify(message);

      if (this.$iFrame) {
        this.$iFrame.contentWindow.postMessage(stringMessage, '*');
      } else {
        window.parent.postMessage(stringMessage, '*');
      }
    }

    /**
     * @param {action} name
     * @param {function} handler
     * @return {IFrameCommunicator}
     */

  }, {
    key: 'subscribeActionToHandler',
    value: function subscribeActionToHandler(action, handler) {
      this.registeredActions[action] = handler;
    }
  }]);

  return IframeActionCommunicator;
}();