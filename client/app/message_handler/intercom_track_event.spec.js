'use strict';

const FakeWindow = require('../mocks/fake_window');
const MessageHandler = require('./intercom_track_event');

describe('Intercom TrackEvent handler', function() {

  let fakeWindow;
  let messageHandler;

  beforeEach(function() {
    fakeWindow = FakeWindow.create(this.sandbox);
    messageHandler = new MessageHandler(fakeWindow);
  });

  it('should listen to messages with event "intercom:track_event"', function() {
    expect(messageHandler.MESSAGE_EVENT).to.eql('intercom:track_event');
  });


  it('should call Intercom upon receiving proper messages', function() {
    fakeWindow.Intercom = this.sandbox.stub();

    messageHandler.handleMessage({
      data: {
        name: 'test-name',
        metadata: { testKey: 'testValue' }
      }
    });

    expect(fakeWindow.Intercom).to.have.been.calledWith('trackEvent', 'test-name', { testKey: 'testValue' });
    expect(fakeWindow.Intercom).to.have.been.calledWith('update');
  });

});
