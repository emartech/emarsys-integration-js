'use strict';

const consts = require('../../consts');
const Dialog = require('./dialog');

class Confirm extends Dialog {

  render() {
    super.render();

    let $eModal = $(this._modal);
    $eModal.attr('data-params', JSON.stringify({
      integrationId: this.options.source.integration_id,
      integrationInstanceId: consts.EMARSYS_INTEGRATION_ID,
      openerIntegrationInstanceId: this.options.source.integration_instance_id,
      dialogId: this.options.data.dialogId
    }));

    return this._modal;
  }

  getModalOptions() {
    let modalOptions = super.getModalOptions();
    let cancelButton = this.cleanMessage(this.options.data.cancel);
    let okButton = this.cleanMessage(this.options.data.ok);
    modalOptions.buttons = {
      [cancelButton]: {
        callback: function() {
          window.Emarsys.integration.dialog.submit(false);
        },
        className: 'e-flex__item'
      },
      [okButton]: {
        autofocus: true,
        callback: function() {
          window.Emarsys.integration.dialog.submit(true);
        },
        className: 'e-btn-primary e-flex__item'
      }
    };

    return modalOptions;
  }

  getModalContent() {
    if (this.options.data.body) {
      return this.cleanMessage(this.options.data.body);
    }

    return '';
  }
}

module.exports = Confirm;
