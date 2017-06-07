'use strict';

const AbstractMessageHandler = require('./abstract_message_handler');

class MessageHandlerUnloadInit extends AbstractMessageHandler {

  get MESSAGE_EVENT() {
    return 'intercom:track_event';
  }

  handleMessage(message) {
    const intercom = this.window.Intercom;

    intercom('trackEvent', message.data.name, message.data.metadata);
    intercom('update');
  }

}

module.exports = MessageHandlerUnloadInit;
