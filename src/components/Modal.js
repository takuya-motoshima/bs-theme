import $ from 'jquery';
import 'jquery.niftymodals';
import { ESCAPE_KEYCODE } from '~/config/constant';

export default class {

  constructor(modal, option) {
    if ($.type(modal) === 'string' || modal instanceof HTMLTableElement) modal = $(modal);
    else if (!(modal instanceof $)) throw new TypeError('Wrong parameter type');
    this.modal = modal;
    this.option = $.extend({ keyboard: true }, option);
    $('body').append(this.modal)
    const overlay = $('body').find('.modal-overlay');
    if (overlay.length === 0) $('<div class="modal-overlay"></div>').insertAfter(this.modal)
    else overlay.insertAfter('.modal-container:last');
    this.initialized = false;
    this.listeners = {};
    this.modalOption = {
      contentSelector: '.modal-content',
      closeSelector: '[data-dismiss="modal"]',
      // closeSelector: '.modal-close',
      classAddAfterOpen: 'modal-show',
      beforeOpen: (modal) => this.beforeOpen(modal),
      afterOpen: (modal) => this.afterOpen(modal),
      beforeClose: (modal, event) => this.beforeClose(modal, event),
      afterClose: (modal, event) => this.afterClose(modal, event)
    };
    this.eventKey = +new Date;
    // const observer = new MutationObserver(mutations => {
    //   const classMutations = mutations.filter(({ attributeName }) => attributeName === 'class');
    //   if (!classMutations.length || $(classMutations[0].target).css('visibility') !== 'hidden') return;
    //   this.afterClose();
    // });
    // observer.observe(this.modal.get(0), { attributes: true });
  }


  on(type, listener) {
    this.listeners[type] = listener;
    return this;
  }

  open() {
    if (this.initialized) {
      this.modal.niftyModal('show', this.modalOption);
    } else {
      this.modal.niftyModal(this.modalOption);
      this.initialized = true;
    }
    return new Promise(resolve => this._resolve = resolve);
  }

  close() {
    this.modal.niftyModal('hide', this.modalOption);
    return this;
  }

  beforeOpen() {
    if (!this.option.keyboard) return;
    $(document).on(`keydown.dismiss.${this.eventKey}`,  event => {
      if (event.which !== ESCAPE_KEYCODE) return;
      event.preventDefault();
      this.resolve(false);
    });
  }

  async afterOpen() {
    return new Promise(resolve => {
      const forms = this.modal.find('.modal-body form:first');
      if (!forms.length) return void resolve();
      this.modal.one('transitionend', event => {
        if (/^(visibility|transform|opacity)$/.test(event.originalEvent.propertyName)) {
          forms.eq(0).find('input:visible:enabled:first').focus();
        }
        resolve();
      });
    });
  }

  beforeClose(modal, event) {}

  afterClose(modal, event) {
    if (this.option.keyboard) $(document).off(`keydown.dismiss.${this.eventKey}`);
    const data = event && event.currentTarget ? $(event.currentTarget).data() : {};
    const result = 'result' in data ? data.result : false;
    this.resolve(result);
  }

  resolve(result) {
    if (!this._resolve) return;
    this._resolve(result);
    this._resolve = null;
    this.close();
  }
}