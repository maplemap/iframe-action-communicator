'use strict';

const assert = require('chai').assert;
const expect = require('jest').expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


describe('IFrameActionCommunicator', () => {
  before(() => {
    const dom = new JSDOM(`<!DOCTYPE html><iframe id="iframe"></iframe>`);
    global.window = dom.window;

    global.IframeActionCommunicator = require('./dist/iframe-action-communicator');
  });

  describe('initialization', () => {
    it('parent initialization', () => {
      const iac = new IframeActionCommunicator('iframe');
      assert.strictEqual(iac.parentInstance, true);
    });

    it('iframe initialization', () => {
      const iac = new IframeActionCommunicator();
      assert.strictEqual(iac.parentInstance, false);
    });
  });

  describe('describing to actions', () => {
    it('bind action with handler on parent', () => {
      function actionHandler() {};

      const iac = new IframeActionCommunicator('iframe');
      iac.on('messageFromIframe', actionHandler);

      assert.deepEqual(iac.registeredActions.messageFromIframe, actionHandler);
    });

    it('bind action with handler on iframe', () => {
      function actionHandler() {};

      const iac = new IframeActionCommunicator();
      iac.on('messageFromParent', actionHandler);

      assert.deepEqual(iac.registeredActions.messageFromParent, actionHandler);
    });
  });
});
