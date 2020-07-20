import $ from 'jquery';
import Parsley from 'parsleyjs';
import 'parsleyjs/dist/i18n/ja.js';

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
  constructor(form) {
    this.form = form instanceof $ ? form : $(form);
    this.submit = this.form.find('[type="submit"]:first');
    this.listeners = {
      submit: () => {},
      fieldSuccess: () => {},
      fieldValidate: () => {}
    };
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
}