'use strict';

const _extend = require('lodash/extend');

const consts = require('./consts');
const Receiver = require('emarsys-integration-client').comm.Receiver;
const AlertApi = require('emarsys-integration-client').api.Alert;
const Transmitter = require('./comm/transmitter');
const DialogApi = require('./service/dialog_api');
const DialogFactory = require('./service/dialog_factory');
const connect = require('./connect');
const getFullUrlByTarget = require('./message_handler/get_full_url_by_target').create();
const messageHandlers = [
  require('./message_handler/alert'),
  require('./message_handler/confirm'),
  require('./message_handler/enable_button'),
  require('./message_handler/fit'),
  require('./message_handler/intercom_track_event'),
  require('./message_handler/modal'),
  require('./message_handler/modal_close'),
  require('./message_handler/navigate'),
  require('./message_handler/proxy'),
  require('./message_handler/refresh'),
  require('./message_handler/resize'),
  require('./message_handler/track'),
  require('./message_handler/update_hash'),
  require('./message_handler/unload_init'),
  require('./message_handler/unload_reset')
];

(function(global) {
  global.Emarsys = global.Emarsys || (global.SUITE ? _extend(true, {}, global.SUITE) : {});
  global.Emarsys.config = global.Emarsys.config || (global.SUITE.config ? _extend(true, {}, global.SUITE.config) : {});

  let transmitter = new Transmitter({
    global: global,
    integrationId: consts.EMARSYS_INTEGRATION_ID,
    integrationInstanceId: consts.EMARSYS_INTEGRATION_ID
  });
  let receiver = new Receiver(global);

  global.Emarsys.integration = {
    messageToEmarsys: transmitter.messageToEmarsys.bind(transmitter),
    messageToService: transmitter.messageToService.bind(transmitter),
    addMessageHandler: receiver.addMessageHandler.bind(receiver),
    alert: AlertApi.create(transmitter),
    dialog: new DialogApi(transmitter, DialogFactory.create()),
    getFullUrlByTarget: ({ target, params }) => getFullUrlByTarget({
      sessionId: global.Emarsys.config.session_id,
      target,
      params
    }),
    unload: {
      initialized: false
    }
  };

  messageHandlers.forEach(function(MessageHandlerClass) {
    let messageHandler = new MessageHandlerClass(global, transmitter);
    receiver.addMessageHandler(messageHandler.MESSAGE_EVENT, messageHandler.handleMessage.bind(messageHandler));
  });

  connect(global);
})(window);
