import $ from 'jquery';
import DialogBase from '~/components/DialogBase';

export default class extends DialogBase {
  
  constructor(option) {
    option = $.extend({
      keyboard: true
    }, option);
    const template = `
      <div class="modal-container modal-effect-9 alert-modal">
        <div class="modal-content">
          <div class="modal-body">
            <div class="text-center">
              <span class="modal-main-icon mdi mdi-check text-success"></span>
              <p class="h4" data-message></p>
            </div>
          </div>
          <div class="modal-footer">
            <button action-proceed class="btn btn-primary" type="button">OK</button>
          </div>
        </div>
      </div>`;
    super($(template).appendTo('body'), option);
    this.message = this.modal.find('[data-message]:first');
    this.icon = this.modal.find('.modal-main-icon:first');
    this.modal.on('click', '[action-proceed]', () => {
      this.proceed = true;
      super.close();
    });
  }

  async open(message, icon = 'success') {
    this.message.text(message);
    if (icon === 'warning') {
      this.icon.removeClass('mdi-check text-success mdi-alert-triangle text-warning').addClass('mdi-alert-triangle text-warning');
    } else {
      this.icon.removeClass('mdi-check text-success mdi-alert-triangle text-warning').addClass('mdi-check text-success');
    }
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