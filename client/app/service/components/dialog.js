'use strict';

class Dialog {

  constructor(global, options) {
    this.window = global;
    this.options = options;
    this.integrationInstanceId = Math.floor(Math.random() * 1000000000);
    this._modal;
  }

  get dialogClass() {
    return '';
  }

  render() {
    this._modal = this.getHtml();
    this._modal.open(this.getModalOptions());
    return this._modal;
  }

  getModalOptions() {
    let modalOptions = {
      headline: this.options.data.title,
      width: this.options.data.width + 'px',
      content: this.getModalContent()
    };

    return modalOptions;
  }

  getHtml() {
    const eDialog = document.createElement('e-dialog');
    eDialog.className = this.dialogClass;
    return eDialog;
  }

  cleanMessage(text) {
    return this.window.$('<div>' + text + '</div>').text();
  }

}

module.exports = Dialog;
