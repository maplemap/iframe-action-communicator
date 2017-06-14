(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(root);
  } else {
    // Browser globals (root is window)
    root.IframeActionCommunicator = factory(root);
  }
}(this, (root) => {
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

  const win = root || global.window;

  /**
   * @class IframeActionCommunicator
   * @example
   * ```
   * const com = new IFrameCommunicator();
   * com.on('ready', () => document.querySelector('root').style.backgroundColor = 'blue');
   * com.ready();
   * ```
   */
  class IframeActionCommunicator {
    constructor(iFrameID) {
      this.registeredActions = {};
      this.$iFrame = null;
      this.parentInstance = false;

      if (iFrameID) {
        this.$iFrame = win.document.getElementById(iFrameID);
        if (this.$iFrame) {
          this.parentInstance = true;
        } else {
          return console.error(`${this.constructor.name}: Iframe with '${iFrameID}' id wasn't founded`);
        }
      }

      this.initListener();
    }


    /**
     * @param {string} name
     * @param {function} callback
     * @return {IFrameCommunicator}
     */
    initListener() {
      const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
      const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

      win[eventMethod](messageEvent, (e) => {
        console.log('event', e);
        if (e.source === win) return; // check of sending of the message to itself

        const message = JSONparse(e.data);
        const action = (message.constructor === Object) ? message.action : message;

        if (!action) {
          return console.error(`${this.constructor.name}: Action mustn't be empty. Please, pass action like a string or like an object in key 'action'`);
        }

        if (this.registeredActions[action]) {
          if (message.constructor === Object) {
            return this.registeredActions[message.action](message.data);
          }
          if (typeof message === 'string') {
            return this.registeredActions[action]();
          }
        } else {
          console.error(`${this.constructor.name}: Any handler doesn't subscribe on '${action}' action`);
        }
      }, false);
    }


    /**
     * @param {string} message
     * @param {object} name
     */
    send(message) {
      if (!message || (typeof message !== 'string' && message.constructor !== Object)) {
        return console.error(`${this.constructor.name}: post argument doesn't must empty and type me be 'string' or 'object'`);
      }

      const stringMessage = JSONstringify(message);

      if (this.parentInstance) {
        this.$iFrame.contentWindow.postMessage(stringMessage, '*');
      } else {
        win.parent.postMessage(stringMessage, '*');
      }
    }


    /**
     * @param {action} name
     * @param {function} handler
     */
    on(action, handler) {
      this.registeredActions[action] = handler;
    }
  }


  return IframeActionCommunicator;
}));
