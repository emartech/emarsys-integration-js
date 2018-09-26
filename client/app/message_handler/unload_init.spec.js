'use strict';

const consts = require('../consts');
const FakeWindow = require('../mocks/fake_window');
const MessageHandler = require('./unload_init');
const jquery = require('jquery');

describe('UnloadInit Handler', function() {

  let fakeWindow;
  let messageHandler;

  beforeEach(function() {
    fakeWindow = FakeWindow.create(this.sandbox);
    messageHandler = new MessageHandler(fakeWindow);
  });

  it('should listen to messages with event "unload:init"', function() {
    expect(messageHandler.MESSAGE_EVENT).to.be.eql('unload:init');
  });

  describe('#getFakeConfirmMessage', function() {
    it('should return a message-like data structure', function() {
      const fakeMessage = messageHandler.getFakeConfirmMessage({
        data: {}
      });
      expect(fakeMessage).to.have.all.keys(['data', 'source']);
    });

    it('should use data passed', function() {
      const testData = {
        title: 'test-title',
        body: 'test-body',
        ok: 'test-ok',
        cancel: 'test-cancel',
        style: 'condensed'
      };
      const fakeMessage = messageHandler.getFakeConfirmMessage({
        data: {
          confirm: testData
        }
      });
      expect(fakeMessage.data).to.eql(testData);
    });

    it('should fake source as EMARSYS', function() {
      const fakeMessage = messageHandler.getFakeConfirmMessage({
        data: {}
      });
      expect(fakeMessage.source.integration_id).to.eql(consts.EMARSYS_INTEGRATION_ID);
    });
  });

  describe('#handleMessage', function() {
    const insertLink = (attrs = {}) => jquery('<a>').attr(attrs).appendTo('body');
    const message = {
      source: { integration_instance_id: 'lamantin' },
      data: { selector: 'body' }
    };

    beforeEach(() => fakeWindow.$ = jquery);

    it('should call confirm navigation when link clicked', function() {
      fakeWindow.Emarsys.integration.dialog.confirmNavigation = this.sandbox.stub();
      messageHandler.handleMessage(message);

      insertLink({ href: '#' }).trigger('click');

      expect(fakeWindow.Emarsys.integration.dialog.confirmNavigation).to.have.been.called;
    });

    it('should not call confirm navigation when link has prevent attribute', function() {
      fakeWindow.Emarsys.integration.dialog.confirmNavigation = this.sandbox.stub();
      messageHandler.handleMessage(message);

      insertLink({ href: '#', 'prevent-navigation-confirm': true }).trigger('click');

      expect(fakeWindow.Emarsys.integration.dialog.confirmNavigation).to.not.have.been.called;
    });

    it('should not call confirm navigation when link has no href', function() {
      fakeWindow.Emarsys.integration.dialog.confirmNavigation = this.sandbox.stub();
      messageHandler.handleMessage(message);

      insertLink().trigger('click');

      expect(fakeWindow.Emarsys.integration.dialog.confirmNavigation).to.not.have.been.called;
    });
  });
});
