'use strict';

const AbstractMessageHandler = require('./abstract_message_handler');

class MessageHandlerUnloadInit extends AbstractMessageHandler {

  get MESSAGE_EVENT() {
    return 'unload:init';
  }

  handleMessage(message) {
    const eventNamespace = 'confirm_navigation_' + message.source.integration_instance_id;
    const fakeConfirmMessage = this.getFakeConfirmMessage(message);

    this.window.$(this.window).off('beforeunload.' + eventNamespace);
    this.window.$(this.window).on('beforeunload.' + eventNamespace, function() {
      return fakeConfirmMessage.data.body;
    });

    const linksToWatch = 'a[href][target!="_blank"]:not([onclick]):not([prevent-navigation-confirm])';
    this.window.$(message.data.selector)
      .off('click.' + eventNamespace)
      .on('click.' + eventNamespace, linksToWatch, (event) => {
        if (event.ctrlKey || event.metaKey || event.which === 2 || !event.target.hostname) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        this.window.Emarsys.integration.dialog.confirmNavigation(event.target.href, fakeConfirmMessage);
      });

    this.window.Emarsys.integration.unload.initialized = true;
  }

}

module.exports = MessageHandlerUnloadInit;
