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
    _classCallCheck(this, IframeActionCommunicator);

    this.registeredActions = {};
    this.$iFrame = null;
    this.parentInstance = false;

    if (iFrameID) {
      this.$iFrame = document.getElementById(iFrameID);
      if (this.$iFrame) {
        this.parentInstance = true;
      } else {
        return console.error(this.constructor.name + ': Iframe with \'' + iFrameID + '\' id wasn\'t founded');
      }
    }

    this.initListener();
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @return {IFrameCommunicator}
   */


  _createClass(IframeActionCommunicator, [{
    key: 'initListener',
    value: function initListener() {
      var _this = this;

      var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
      var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
      var listener = window[eventMethod];

      listener(messageEvent, function (e) {
        var message = JSONparse(e.data);
        var action = message.constructor === Object ? message.action : message;

        if (!action) return console.error(_this.constructor.name + ': Action mustn\'t be empty. Please, pass action like a string or like an object in key \'action\'');

        if (_this.registeredActions[action]) {
          if (message.constructor === Object) {
            return _this.registeredActions[message.action](message.data);
          }
          if (typeof message === 'string') {
            return _this.registeredActions[action]();
          }
        } else {
          console.error(_this.constructor.name + ': Any handler doesn\'t subscribe on \'' + action + '\' action');
        }
      }, false);
    }

    /**
     * @param {string} message
     * @param {object} name
     */

  }, {
    key: 'send',
    value: function send(message) {
      if (!message || typeof message !== 'string' && message.constructor !== Object) {
        return console.error(this.constructor.name + ': post argument doesn\'t must empty and type me be \'string\' or \'object\'');
      }

      var stringMessage = JSONstringify(message);

      if (this.parentInstance) {
        this.$iFrame.contentWindow.postMessage(stringMessage, '*');
      } else {
        window.parent.postMessage(stringMessage, '*');
      }
    }

    /**
     * @param {action} name
     * @param {function} handler
     */

  }, {
    key: 'on',
    value: function on(action, handler) {
      this.registeredActions[action] = handler;
    }
  }]);

  return IframeActionCommunicator;
}();