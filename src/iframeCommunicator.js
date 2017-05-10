// const IframeCommunicator = () => {
//   const registratedActions = {};
//   let $iFrame = null;
//
//   function subscribeToListenMessages() {
//     const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
//     const listener = window[eventMethod];
//     const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
//
//     listener(messageEvent, (e) => {
//       const message = e.data;
//       if (message.action) {
//         if (registratedActions[message.action]) {
//           registratedActions[message.action](message.data);
//         }
//       }
//     }, false);
//   }
//
//   this.init = (iFrameID, callback) => {
//     if (iFrameID) {
//       $iFrame = document.getElementById(iFrameID);
//     } else {
//       subscribeToListenMessages();
//     }
//
//     if (typeof callback === 'function') callback();
//   };
//
//   this.post = (message) => {
//     if (!message) return;
//
//     if ($iFrame) {
//       $iFrame.contentWindow.postMessage(message, '*');
//     } else {
//       window.parent.postMessage(message, '*');
//     }
//   };
//
//   this.subscribeHandlerToAction = (action, handler) => {
//     registratedActions[action] = handler;
//   };
// };

function toJSON(value) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return false;
  }
}

function fromJSON(value) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return false;
  }
}

class IframeCommunicator {
  constructor(iFrameID) {
    if (iFrameID) {
      $iFrame = document.getElementById(iFrameID);
    } else {
      subscribeToListenMessages();
    }
  }
}
