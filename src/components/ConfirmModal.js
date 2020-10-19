import $ from 'jquery';
import { Template } from 'js-shared'
import Modal from '~/components/Modal';

export default class extends Modal {

  constructor(option = {}) {
    option.buttons = $.extend({
      ok: 'OK',
      cancel: 'Cancel'
    }, option.buttons || {});
    option = $.extend({ keyboard: true }, option);
    const template = `
      <div class="modal-container modal-effect-9 confirm-modal">
        <div class="modal-content">
          <div class="modal-body">
            <div class="text-center">
              <span class="modal-main-icon mdi mdi-alert-triangle text-warning"></span>
              <h3 data-title></h3>
              <p data-message></p>
              <div class="mt-8">
                <button class="btn btn-space btn-primary" type="button" data-dismiss="modal" data-result="true">{{ok}}</button>
                <button class="btn btn-space btn-dark modal-close" type="button" data-dismiss="modal">{{cancel}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    super($(Template.compile(template)(option.buttons)).appendTo('body'), option);
    this.title = this.modal.find('[data-title]:first');
    this.message = this.modal.find('[data-message]:first');
  }

  async open(title = '', message = '') {
    this.title.text(title);
    this.message.text(message);
    return super.open();
  }

  async afterOpen() {
    await super.afterOpen();
    this.modal.find('[action-ok]:first').focus();
  }
}