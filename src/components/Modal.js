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
    this.mdOption = {
      contentSelector: '.modal-content',
      closeSelector: '.modal-close',
      classAddAfterOpen: 'modal-show',
      beforeOpen: () => this.beforeOpen(),
      afterOpen: () => this.afterOpen(),
      beforeClose: () => this.beforeClose(),
      // afterClose: () => this.afterClose()
    };
    this.eventKey = +new Date;
    const observer = new MutationObserver(mutations => {
      const classMutations = mutations.filter(({ attributeName }) => attributeName === 'class');
      if (!classMutations.length || $(classMutations[0].target).css('visibility') !== 'hidden') return;
      this.afterClose();
    });
    observer.observe(this.modal.get(0), { attributes: true });
  }


  on(type, listener) {
    this.listeners[type] = listener;
    return this;
  }

  open() {
    if (this.initialized) {
      this.modal.niftyModal('show', this.mdOption);
    } else {
      this.modal.niftyModal(this.mdOption);
      this.initialized = true;
    }
    this.proceed = false;
    return new Promise(resolve => this.resolve = resolve);
  }

  close() {
    this.modal.niftyModal('hide', this.mdOption);
    return this;
  }

  beforeOpen() {
    if (!this.option.keyboard) return;
    $(document).on(`keydown.dismiss.${this.eventKey}`,  event => {
      if (event.which !== ESCAPE_KEYCODE) return;
      event.preventDefault();
      this.resolve(false);
      this.close();
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

  beforeClose() {}

  afterClose() {
    if (!this.option.keyboard) return;
    $(document).off(`keydown.dismiss.${this.eventKey}`);
  }
}