import $ from 'jquery';
import { Template } from 'js-shared'
import DialogBase from '~/components/DialogBase';

export default class extends DialogBase {

  constructor(option) {
    option = $.extend({
      keyboard: true,
      buttons: {
        ok: 'OK',
        cancel: 'Cancel'
      }
    }, option);
    const template = `
      <div class="modal-container modal-effect-9 confirm-modal">
        <div class="modal-content">
          <!-- <div class="modal-header">
            <button class="close modal-close" type="button" data-dismiss="modal" aria-hidden="true"><span class="mdi mdi-close"></span></button>
          </div> -->
          <div class="modal-body">
            <div class="text-center">
              <span class="modal-main-icon mdi mdi-alert-triangle text-warning"></span>
              <h3 data-title></h3>
              <p data-message></p>
              <div class="mt-8">
                <button action-proceed class="btn btn-space btn-primary" type="button">{{ok}}</button>
                <button class="btn btn-space btn-dark modal-close" type="button" data-dismiss="modal">{{cancel}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    super($(Template.compile(template)(buttons)).appendTo('body'), option);
    this.title = this.modal.find('[data-title]:first');
    this.message = this.modal.find('[data-message]:first');
    this.modal.on('click', '[action-proceed]', () => {
      this.proceed = true;
      super.close();
    });
  }

  async open(title = '', message = '') {
    this.title.text(title);
    this.message.text(message);
    return super.open();
  }

  async afterOpen() {
    await super.afterOpen();
    this.modal.find('[action-proceed]:first').focus();
  }

  afterClose() {
    super.afterClose();
    this.resolve(this.proceed);
  }
}