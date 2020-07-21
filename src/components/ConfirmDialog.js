import $ from 'jquery';
import { Template } from 'js-shared'
import DialogBase from '~/components/DialogBase';

export default class extends DialogBase {

  constructor({ keyboard = true, cancelable = true, okButton = 'OK', cancelButton = 'キャンセル' } = {}) {
    const template = `
      <div class="modal-container modal-effect-9 confirm-modal">
        <div class="modal-content">
          {{#if cancelable}}
            <div class="modal-header">
              <button class="close modal-close" type="button" data-dismiss="modal" aria-hidden="true"><span class="mdi mdi-close"></span></button>
            </div>
          {{/if}}
          <div class="modal-body">
            <div class="text-center">
              <span class="modal-main-icon mdi mdi-alert-triangle text-warning"></span>
              <h3 data-title></h3>
              <p data-message></p>
              <div class="mt-8">
                <button action-proceed class="btn btn-space btn-primary" type="button">{{okButton}}</button>
                {{#if cancelable}}
                  <button class="btn btn-space btn-secondary modal-close" type="button" data-dismiss="modal">{{cancelButton}}</button>
                {{/if}}
              </div>
            </div>
          </div>
        </div>
      </div>`;
    super($(Template.compile(template)({ cancelable, okButton, cancelButton })).appendTo('body'), { keyboard });
    this.cancelable = cancelable;
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

  beforeClose() {
    super.beforeClose();
    if (!this.cancelable) return false;
  }

  afterClose() {
    super.afterClose();
    this.resolve(this.proceed);
  }
}