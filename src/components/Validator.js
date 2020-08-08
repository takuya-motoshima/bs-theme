import $ from 'jquery';
import Parsley from 'parsleyjs';
import 'parsleyjs/dist/i18n/al';
import 'parsleyjs/dist/i18n/ar';
import 'parsleyjs/dist/i18n/bg';
import 'parsleyjs/dist/i18n/ca';
import 'parsleyjs/dist/i18n/cs';
import 'parsleyjs/dist/i18n/da';
import 'parsleyjs/dist/i18n/de';
import 'parsleyjs/dist/i18n/el';
import 'parsleyjs/dist/i18n/en';
import 'parsleyjs/dist/i18n/es';
import 'parsleyjs/dist/i18n/et';
import 'parsleyjs/dist/i18n/eu';
import 'parsleyjs/dist/i18n/fa';
import 'parsleyjs/dist/i18n/fi';
import 'parsleyjs/dist/i18n/fr';
import 'parsleyjs/dist/i18n/he';
import 'parsleyjs/dist/i18n/hr';
import 'parsleyjs/dist/i18n/hu';
import 'parsleyjs/dist/i18n/id';
import 'parsleyjs/dist/i18n/it';
import 'parsleyjs/dist/i18n/ja';
import 'parsleyjs/dist/i18n/ko';
import 'parsleyjs/dist/i18n/lt';
import 'parsleyjs/dist/i18n/lv';
import 'parsleyjs/dist/i18n/ms';
import 'parsleyjs/dist/i18n/nl';
import 'parsleyjs/dist/i18n/no';
import 'parsleyjs/dist/i18n/pl';
import 'parsleyjs/dist/i18n/pt-br';
import 'parsleyjs/dist/i18n/pt-pt';
import 'parsleyjs/dist/i18n/ro';
import 'parsleyjs/dist/i18n/ru';
import 'parsleyjs/dist/i18n/sk';
import 'parsleyjs/dist/i18n/sl';
import 'parsleyjs/dist/i18n/sq';
import 'parsleyjs/dist/i18n/sr';
import 'parsleyjs/dist/i18n/sv';
import 'parsleyjs/dist/i18n/th';
import 'parsleyjs/dist/i18n/tk';
import 'parsleyjs/dist/i18n/tr';
import 'parsleyjs/dist/i18n/ua';
import 'parsleyjs/dist/i18n/uk';
import 'parsleyjs/dist/i18n/ur';
import 'parsleyjs/dist/i18n/zh_cn';
import 'parsleyjs/dist/i18n/zh_tw';

// Add password verification
Parsley.addValidator('password', {
  requirementType: 'string',
  validateString: value => {
    /*
      At least 8 characters long
      At least 1 alphabet letter
      At least 1 special character
      At least 1 numeric character
    */
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/i.test(value);
    // /*
    //   At least 8 characters long
    //   At least 1 capital letter
    //   At least 1 lowercase letter
    //   At least 1 special character
    //   At least 1 numeric character
    // */
    // return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test();
  },
  messages: {
    ja: 'パスワードは英数記号をそれぞれ1文字以上含めてください。',
    en: 'The password must contain at least one letter, number, and symbol.'
  }
});

export default class {

  /**
   * @param  {string|HTMLFormElement|jqElement} form   [description]
   * @param  {al|ar|bg|ca|cs|da|de|el|en|es|et|eu|fa|fi|fr|he|hr|hu|id|it|ja|ko|lt|lv|ms|nl|no|pl|pt-br|pt-pt|ro|ru|sk|sl|sq|sr|sv|th|tk|tr|ua|uk|ur|zh_cn|zh_tw} locale 
   */
  constructor(form, locale = 'en') {
    if ($.type(form) === 'string' || form instanceof HTMLFormElement) form = $(form);
    else if (!(form instanceof $)) throw new TypeError('Wrong parameter type');
    this.form = form;
    this.submit = this.form.find('[type="submit"]:first');
    if (!this.submit.length && this.form.attr('id') && $(`[type="submit"][form="${this.form.attr('id')}"]`).length)
      this.submit = $(`[type="submit"][form="${this.form.attr('id')}"]`);
    this.listeners = {
      submit: () => {},
      fieldSuccess: () => {},
      fieldValidate: () => {}
    };
    Parsley.setLocale(locale);
    this.parsley = this.form.parsley({
      inputs: 'input,textarea,select,input[type=hidden],:hidden',
      excluded: 'input[type=button],input[type=submit],input[type=reset],[disabled]',
      errorsContainer: parsleyField => {
        let container = parsleyField.$element.closest('.form-group');
        if (container.hasClass('row')) {
          container = parsleyField.$element.parent();
          if (container.hasClass('input-group')) {
            container = container.parent();
          }
        }
        if (!container.length) container = parsleyField.$element.closest('fieldset');
        return container;
      }
    });
    this.form.on('submit', event => {
      event.preventDefault();
      this.isValidForm() && this.listeners.submit(event);
    });
    this.form.on('input', 'input', () => {
      if (this.isValidForm()) this.submit.removeClass('disabled');
      else this.submit.addClass('disabled');
    });
    this.parsley
      .on('field:success', event => {
        const $field = $(event.$element);
        this.listeners.fieldSuccess($field.attr('name'), $field);
      })
      .on('field:validate', event => {
        const $field = $(event.$element);
        this.listeners.fieldValidate($field.attr('name'), $field);
      });
  }

  on(type, listener) {
    this.listeners[type] = listener;
    return this;
  }

  excludeFieldValidation(name, exclude) {
    this.form.find(`[name="${name}"]:first`).attr('data-parsley-excluded', exclude ? 'true' : 'false');
    return this;
  }

  isValidForm() {
    return this.parsley.isValid();
  }

  resetForm() {
    this.form.get(0).reset();
    this.parsley.reset();
    return this;
  }

  getField(name) {
    // Escape selector
    name = name.replace(/[\[\]]/g, '\\$&');
    return this.form.find(`[name=${name}]`).parsley();
  }

  getFormData() {
    return new FormData(this.form.get(0));
  }

  removeFieldError(name, error) {
    const field = this.getField(name);
    field.removeError(error);
    return this;
  }

  addFieldError(name, error, message) {
    this.getField(name).addError(error, { message });
    return this;
  }

  disableSubmit() {
    this.submit.prop('disabled', true);
  }

  enableSubmit() {
    this.submit.prop('disabled', false);
  }

  addValidator(name, validator, priority) {
    Parsley.addValidator(name, validator, priority);
  }
}