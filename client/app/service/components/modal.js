'use strict';

const _extend = require('lodash/extend');
const Dialog = require('./dialog');

class Modal extends Dialog {

  get dialogClass() {
    return 'e-dialog-iframe';
  }

  constructor(global, options) {
    super(global, options);

    this.options.data = _extend({
      width: 650,
      height: 500
    }, this.options.data);
  }

  render() {
    super.render();

    let $eModal = $(this._modal);
    $eModal.css('opacity', 0);
    $eModal.find('iframe').load(() => {
      this.window.setTimeout(() => {
        $eModal.css('opacity', 1);
      }, 0);
    });

    return this._modal;
  }

  getAttributes() {
    let attributes = [
      'frameborder="0"',
      'class="integration integration-' + this.options.source.integration_id + '"',
      'id="integration-' + this.integrationInstanceId + '"'
    ];

    ['src', 'width', 'height'].forEach((attributeName) => {
      attributes.push(attributeName + '="' + this.options.data[attributeName] + '"');
    });

    return attributes;
  }

  decorateUrl() {
    const glue = this.options.data.src.indexOf('?') < 0 ? '?' : '&';

    const params = [
      'dialogId=' + this.options.data.dialogId,
      'integration_id=' + this.options.source.integration_id,
      'integration_instance_id=' + this.integrationInstanceId,
      'opener_integration_instance_id=' + this.options.source.integration_instance_id
    ];

    return this.options.data.src + glue + params.join('&');
  }

  getModalOptions() {
    let modalOptions = super.getModalOptions();
    modalOptions.height = this.options.data.height + 'px';

    return modalOptions;
  }

  getModalContent() {
    this.options.data.src = this.decorateUrl();

    return '<iframe ' + this.getAttributes().join(' ') + '></iframe>';
  }

}

module.exports = Modal;
